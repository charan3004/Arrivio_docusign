import 'dotenv/config';
import docusign from 'docusign-esign';

const REQUIRED_ENV_VARS = [
  'DOCUSIGN_INTEGRATION_KEY',
  'DOCUSIGN_CLIENT_SECRET',
  'DOCUSIGN_REDIRECT_URI',
  'DOCUSIGN_BASE_URL',
];

const LEASE_TEMPLATE_ID = (
  process.env.DOCUSIGN_TEMPLATE_ID || 'a4e8d5df-2eb4-46df-9abe-dcbac3fd25cf'
).trim();

let latestOAuthSession = null;

export function getLatestOAuthSession() {
  return latestOAuthSession;
}

function getMissingEnvVars() {
  return REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
}

function normalizeOAuthBasePath(baseUrl) {
  try {
    const parsed = new URL(baseUrl);
    return parsed.host;
  } catch (error) {
    throw new Error('DOCUSIGN_BASE_URL must be a valid URL (for example: https://account-d.docusign.com)');
  }
}

function normalizeRestApiBasePath(baseUri) {
  try {
    const parsed = new URL(baseUri);
    return `${parsed.origin}/restapi`;
  } catch (error) {
    throw new Error('Stored DocuSign baseUri is invalid');
  }
}

function getErrorMessage(error) {
  return error?.response?.body?.error_description || error?.response?.body?.error || error.message;
}

function createApiClient() {
  const missingEnvVars = getMissingEnvVars();
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required DocuSign environment variables: ${missingEnvVars.join(', ')}`);
  }

  const apiClient = new docusign.ApiClient();
  apiClient.setOAuthBasePath(normalizeOAuthBasePath(process.env.DOCUSIGN_BASE_URL));

  return apiClient;
}

export function getAuthorizationUrl() {
  try {
    const apiClient = createApiClient();

    return apiClient.getAuthorizationUri(
      process.env.DOCUSIGN_INTEGRATION_KEY,
      ['signature', 'impersonation'],
      process.env.DOCUSIGN_REDIRECT_URI,
      'code'
    );
  } catch (error) {
    throw new Error(`Failed to generate DocuSign authorization URL: ${error.message}`);
  }
}

export async function exchangeCodeForToken(code) {
  if (!code) {
    throw new Error('Authorization code is required');
  }

  try {
    const apiClient = createApiClient();

    const tokenResponse = await apiClient.generateAccessToken(
      process.env.DOCUSIGN_INTEGRATION_KEY,
      process.env.DOCUSIGN_CLIENT_SECRET,
      code
    );

    const accessToken = tokenResponse.accessToken;
    if (!accessToken) {
      throw new Error('DocuSign did not return an access token');
    }

    const userInfo = await apiClient.getUserInfo(accessToken);
    const defaultAccount = userInfo.accounts?.find((account) => account.isDefault) || userInfo.accounts?.[0];

    if (!defaultAccount) {
      throw new Error('No DocuSign account information found for authenticated user');
    }

    latestOAuthSession = {
      accessToken,
      accountId: defaultAccount.accountId,
      baseUri: defaultAccount.baseUri,
    };

    return latestOAuthSession;
  } catch (error) {
    throw new Error(`Failed to exchange DocuSign authorization code: ${getErrorMessage(error)}`);
  }
}

export async function sendLeaseEnvelope({ email, name }) {
  if (!latestOAuthSession) {
    throw new Error('No DocuSign OAuth session found. Authorize first.');
  }

  if (!email || !name) {
    throw new Error('Both email and name are required to send lease envelope');
  }

  if (!LEASE_TEMPLATE_ID) {
    throw new Error('DocuSign templateId is missing. Set DOCUSIGN_TEMPLATE_ID in environment.');
  }

  try {
    const { accessToken, accountId, baseUri } = latestOAuthSession;

    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath(normalizeRestApiBasePath(baseUri));
    apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);

    const envelopesApi = new docusign.EnvelopesApi(apiClient);

    const templateRole = docusign.TemplateRole.constructFromObject({
      email,
      name,
      roleName: 'Tenant',
    });

    const envelopeDefinition = docusign.EnvelopeDefinition.constructFromObject({
      templateId: LEASE_TEMPLATE_ID,
      templateRoles: [templateRole],
      status: 'sent',
    });

    const envelopeSummary = await envelopesApi.createEnvelope(accountId, {
      envelopeDefinition,
    });

    if (!envelopeSummary?.envelopeId) {
      throw new Error('DocuSign did not return envelopeId');
    }

    return envelopeSummary.envelopeId;
  } catch (error) {
    console.error('DocuSign sendLeaseEnvelope error');
    console.error('error.response.data:', error.response?.data);
    console.error('error.response.status:', error.response?.status);
    console.error('error.message:', error.message);
    if (error?.response) {
      console.error('error.response:', error.response);
    } else {
      console.error('error:', error);
    }
    throw error;
  }
}
