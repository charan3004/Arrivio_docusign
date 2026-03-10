import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import docusign from 'docusign-esign';

const REQUIRED_ENV_VARS = [
  'DOCUSIGN_INTEGRATION_KEY',
  'DOCUSIGN_CLIENT_SECRET',
  'DOCUSIGN_REDIRECT_URI',
];

const DOCUSIGN_AUTH_SCOPES = ['signature', 'extended'];

const LEASE_TEMPLATE_ID = (
  process.env.DOCUSIGN_TEMPLATE_ID || 'a4e8d5df-2eb4-46df-9abe-dcbac3fd25cf'
).trim();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SESSION_FILE_PATH = path.join(__dirname, '..', '.docusign-session.json');
const SESSION_REFRESH_BUFFER_MS = 5 * 60 * 1000;

let latestOAuthSession = null;
let persistedSessionLoaded = false;

export function getLatestOAuthSession() {
  return latestOAuthSession;
}

async function loadPersistedOAuthSession() {
  if (persistedSessionLoaded) {
    return latestOAuthSession;
  }

  persistedSessionLoaded = true;

  try {
    const raw = await fs.readFile(SESSION_FILE_PATH, 'utf8');
    latestOAuthSession = JSON.parse(raw);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Failed to load persisted DocuSign session:', error.message);
    }
  }

  return latestOAuthSession;
}

async function persistOAuthSession(session) {
  latestOAuthSession = session;
  persistedSessionLoaded = true;
  await fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session, null, 2));
}

function getMissingEnvVars() {
  return REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
}

function getOAuthServerUrl() {
  return process.env.DOCUSIGN_AUTH_SERVER || process.env.DOCUSIGN_BASE_URL;
}

function normalizeOAuthBasePath(baseUrl = getOAuthServerUrl()) {
  try {
    const parsed = new URL(baseUrl);
    return parsed.host;
  } catch (error) {
    throw new Error('DOCUSIGN_AUTH_SERVER or DOCUSIGN_BASE_URL must be a valid URL (for example: https://account-d.docusign.com)');
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

function buildOAuthSession({ tokenResponse, accountId, baseUri }) {
  const expiresInSeconds = Number(tokenResponse.expiresIn || tokenResponse.expires_in || 0);

  return {
    accessToken: tokenResponse.accessToken,
    refreshToken: tokenResponse.refreshToken || tokenResponse.refresh_token || null,
    accountId,
    baseUri,
    expiresAt: expiresInSeconds
      ? new Date(Date.now() + expiresInSeconds * 1000).toISOString()
      : null,
  };
}

function isSessionUsable(session) {
  if (!session?.accessToken || !session?.accountId || !session?.baseUri) {
    return false;
  }

  if (!session.expiresAt) {
    return true;
  }

  return Date.parse(session.expiresAt) - Date.now() > SESSION_REFRESH_BUFFER_MS;
}

async function refreshOAuthSession(session) {
  if (!session?.refreshToken) {
    throw new Error('DocuSign refresh token is unavailable. Re-authorize the integration.');
  }

  const clientString = `${process.env.DOCUSIGN_INTEGRATION_KEY}:${process.env.DOCUSIGN_CLIENT_SECRET}`;
  const response = await axios.request({
    baseURL: `https://${normalizeOAuthBasePath()}`,
    method: 'post',
    url: '/oauth/token',
    headers: {
      Authorization: `Basic ${Buffer.from(clientString).toString('base64')}`,
      'Cache-Control': 'no-store',
      Pragma: 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: session.refreshToken,
    }).toString(),
  });

  const tokenData = response.data ?? {};
  const apiClient = createApiClient();
  const accessToken = tokenData.access_token || tokenData.accessToken;
  const refreshToken = tokenData.refresh_token || tokenData.refreshToken || session.refreshToken;

  if (!accessToken) {
    throw new Error('DocuSign refresh did not return an access token');
  }

  const userInfo = await apiClient.getUserInfo(accessToken);
  const defaultAccount = userInfo.accounts?.find((account) => account.isDefault) || userInfo.accounts?.[0];

  if (!defaultAccount) {
    throw new Error('No DocuSign account information found after refreshing token');
  }

  const refreshedSession = buildOAuthSession({
    tokenResponse: {
      accessToken,
      refreshToken,
      expiresIn: tokenData.expires_in || tokenData.expiresIn,
    },
    accountId: defaultAccount.accountId,
    baseUri: defaultAccount.baseUri,
  });

  await persistOAuthSession(refreshedSession);
  return refreshedSession;
}

export async function getValidOAuthSession() {
  const session = latestOAuthSession ?? await loadPersistedOAuthSession();

  if (!session) {
    throw new Error('No DocuSign OAuth session found. Authorize first.');
  }

  if (isSessionUsable(session)) {
    return session;
  }

  return refreshOAuthSession(session);
}

function createApiClient() {
  const missingEnvVars = getMissingEnvVars();
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required DocuSign environment variables: ${missingEnvVars.join(', ')}`);
  }

  const apiClient = new docusign.ApiClient();
  apiClient.setOAuthBasePath(normalizeOAuthBasePath());

  return apiClient;
}

export function getAuthorizationUrl() {
  try {
    const apiClient = createApiClient();

    return apiClient.getAuthorizationUri(
      process.env.DOCUSIGN_INTEGRATION_KEY,
      DOCUSIGN_AUTH_SCOPES,
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

    const session = buildOAuthSession({
      tokenResponse,
      accountId: defaultAccount.accountId,
      baseUri: defaultAccount.baseUri,
    });

    await persistOAuthSession(session);
    return session;
  } catch (error) {
    throw new Error(`Failed to exchange DocuSign authorization code: ${getErrorMessage(error)}`);
  }
}

export async function sendLeaseEnvelope({ email, name }) {
  if (!email || !name) {
    throw new Error('Both email and name are required to send lease envelope');
  }

  if (!LEASE_TEMPLATE_ID) {
    throw new Error('DocuSign templateId is missing. Set DOCUSIGN_TEMPLATE_ID in environment.');
  }

  try {
    const { accessToken, accountId, baseUri } = await getValidOAuthSession();

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
