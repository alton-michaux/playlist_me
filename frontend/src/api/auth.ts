import { apiClient } from './client';
import type { SpotifyUserProfile } from '../types/spotify';

export async function getLoginUrl(): Promise<string> {
  const response = await apiClient.get<{ url: string }>('/login');
  return response.data.url;
}

export interface CallbackResult {
  user: SpotifyUserProfile;
  access_token: string;
  expires_in: number;
}

export async function callbackExchange(code: string, state: string): Promise<CallbackResult> {
  const response = await apiClient.get<CallbackResult>('/callback', {
    params: { code, state },
  });
  return response.data;
}

export async function refreshToken(userId: string): Promise<{ access_token: string; expires_in: number }> {
  const response = await apiClient.get<{ access_token: string; expires_in: number }>(
    '/refresh',
    { params: { userId } }
  );
  return response.data;
}
