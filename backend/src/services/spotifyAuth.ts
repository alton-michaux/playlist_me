import axios from 'axios';
import crypto from 'crypto';
import { addState } from './stateStore';
import type { SpotifyTokenResponse, SpotifyUserProfile } from '../types/spotify';

const SPOTIFY_ACCOUNTS_BASE = 'https://accounts.spotify.com';

const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-library-modify',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-follow-modify',
].join(' ');

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

export function buildAuthUrl(): string {
  const clientId = getRequiredEnv('SPOTIFY_CLIENT_ID');
  const redirectUri = getRequiredEnv('SPOTIFY_REDIRECT_URI');

  const state = crypto.randomBytes(16).toString('hex');
  addState(state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: SCOPES,
    redirect_uri: redirectUri,
    state,
  });

  return `${SPOTIFY_ACCOUNTS_BASE}/authorize?${params.toString()}`;
}

function getBasicAuthHeader(): string {
  const clientId = getRequiredEnv('SPOTIFY_CLIENT_ID');
  const clientSecret = getRequiredEnv('SPOTIFY_CLIENT_SECRET');
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
}

export async function exchangeCode(code: string): Promise<SpotifyTokenResponse> {
  const redirectUri = getRequiredEnv('SPOTIFY_REDIRECT_URI');

  const response = await axios.post<SpotifyTokenResponse>(
    `${SPOTIFY_ACCOUNTS_BASE}/api/token`,
    new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
    {
      headers: {
        Authorization: getBasicAuthHeader(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data;
}

export async function refreshAccessToken(refreshToken: string): Promise<SpotifyTokenResponse> {
  const response = await axios.post<SpotifyTokenResponse>(
    `${SPOTIFY_ACCOUNTS_BASE}/api/token`,
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    {
      headers: {
        Authorization: getBasicAuthHeader(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data;
}

export async function getClientCredentialsToken(): Promise<SpotifyTokenResponse> {
  const response = await axios.post<SpotifyTokenResponse>(
    `${SPOTIFY_ACCOUNTS_BASE}/api/token`,
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      headers: {
        Authorization: getBasicAuthHeader(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data;
}

export async function getUserProfile(accessToken: string): Promise<SpotifyUserProfile> {
  const response = await axios.get<SpotifyUserProfile>(
    'https://api.spotify.com/v1/me',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data;
}
