import express from 'express';
import docusign from 'docusign-esign';
import {
    getAuthorizationUrl,
    exchangeCodeForToken,
    sendLeaseEnvelope,
    getLatestOAuthSession,
} from '../services/docusign.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();

function normalizeRestApiBasePath(baseUri) {
    const parsed = new URL(baseUri);
    return `${parsed.origin}/restapi`;
}

async function downloadSignedPdf({ accessToken, accountId, baseUri, envelopeId }) {
    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath(normalizeRestApiBasePath(baseUri));
    apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);

    const envelopesApi = new docusign.EnvelopesApi(apiClient);
    const pdfData = await envelopesApi.getDocument(accountId, envelopeId, 'combined');

    if (Buffer.isBuffer(pdfData)) {
        return pdfData;
    }

    if (pdfData instanceof ArrayBuffer) {
        return Buffer.from(pdfData);
    }

    if (typeof pdfData === 'string') {
        return Buffer.from(pdfData, 'binary');
    }

    if (pdfData?.data) {
        if (Buffer.isBuffer(pdfData.data)) {
            return pdfData.data;
        }
        if (pdfData.data instanceof ArrayBuffer) {
            return Buffer.from(pdfData.data);
        }
        if (Array.isArray(pdfData.data)) {
            return Buffer.from(pdfData.data);
        }
    }

    throw new Error('Unable to convert DocuSign document response to Buffer');
}

async function uploadSignedPdfToStorage({ envelopeId, pdfBuffer }) {
    const filePath = `lease_${envelopeId}.pdf`;

    const { error: uploadError } = await supabase.storage
        .from('leases')
        .upload(filePath, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: true,
        });

    if (uploadError) {
        throw new Error(`Supabase storage upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
        .from('leases')
        .getPublicUrl(filePath);

    const publicUrl = publicUrlData?.publicUrl;
    if (!publicUrl) {
        throw new Error('Failed to generate public URL for uploaded lease PDF');
    }

    return publicUrl;
}

router.get('/auth', async (req, res) => {
    try {
        const authorizationUrl = getAuthorizationUrl();
        return res.redirect(authorizationUrl);
    } catch (error) {
        return res.status(500).json({
            error: 'Failed to generate DocuSign authorization URL',
            details: error.message,
        });
    }
});

router.get('/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'Missing required query parameter: code' });
    }

    try {
        const { accessToken, accountId, baseUri } = await exchangeCodeForToken(code);
        return res.json({ accessToken, accountId, baseUri });
    } catch (error) {
        return res.status(500).json({
            error: 'Failed to exchange authorization code for token',
            details: error.message,
        });
    }
});

router.post('/send', async (req, res) => {
    const { email, name, bookingIntentId, userId } = req.body ?? {};

    if (!email || !name || !bookingIntentId || !userId) {
        return res.status(400).json({
            error: 'email, name, bookingIntentId and userId are required',
        });
    }

    try {
        const envelopeId = await sendLeaseEnvelope({ email, name });

        const { error } = await supabase
            .from('leases')
            .insert([
                {
                    envelope_id: envelopeId,
                    booking_intent_id: bookingIntentId,
                    user_id: userId,
                    user_name: name,
                    user_email: email,
                    status: 'sent',
                },
            ]);

        if (error) {
            console.error('Supabase insert error:', error);
            return res.status(500).json({
                success: false,
                message: 'Envelope sent but DB insert failed',
            });
        }

        return res.json({
            success: true,
            envelopeId,
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Failed to send lease envelope',
            details: error.message,
        });
    }
});

router.post('/applications', async (req, res) => {
    const application = req.body?.application ?? req.body ?? {};
    const { user_id, property_id } = application;

    if (!user_id || !property_id) {
        return res.status(400).json({
            error: 'user_id and property_id are required',
        });
    }

    try {
        const { data, error } = await supabase
            .from('lease_applications')
            .insert([application])
            .select()
            .single();

        if (error) {
            return res.status(500).json({
                error: 'Failed to create lease application',
                details: error.message,
                code: error.code,
            });
        }

        return res.status(200).json({ success: true, application: data });
    } catch (error) {
        return res.status(500).json({
            error: 'Unexpected server error while creating lease application',
            details: error.message,
        });
    }
});

router.post('/webhook', async (req, res) => {
    try {
        console.log('Webhook payload received:');
        console.log(JSON.stringify(req.body, null, 2));

        const event = req.body?.event;
        const envelopeId = req.body?.data?.envelopeId;

        if (!event || !envelopeId) {
            console.log('Missing event or envelopeId');
            return res.status(400).json({ error: 'Invalid webhook payload' });
        }

        console.log('Event:', event);
        console.log('Envelope ID:', envelopeId);

        if (event === 'envelope-completed') {
            const session = getLatestOAuthSession();
            if (!session?.accessToken || !session?.accountId || !session?.baseUri) {
                return res.status(500).json({
                    error: 'DocuSign session is unavailable for PDF download',
                });
            }

            const pdfBuffer = await downloadSignedPdf({
                accessToken: session.accessToken,
                accountId: session.accountId,
                baseUri: session.baseUri,
                envelopeId,
            });

            const signedPdfUrl = await uploadSignedPdfToStorage({
                envelopeId,
                pdfBuffer,
            });

            const { error } = await supabase
                .from('leases')
                .update({
                    status: 'completed',
                    lease_signed: true,
                    signed_pdf_url: signedPdfUrl,
                })
                .eq('envelope_id', envelopeId);

            if (error) {
                console.error('DB update error:', error);
                return res.status(500).json({ error: 'DB update failed' });
            }

            console.log('Lease marked as completed in DB with signed PDF URL');
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(500).json({ error: error.message });
    }
});

export default router;
