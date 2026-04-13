import { apiClient } from './client';
import type { SpotifyTrack } from '../types/spotify';

export async function getSong(trackID: string, token: string): Promise<SpotifyTrack> {
  const response = await apiClient.get<SpotifyTrack>('/song', {
    params: { trackID, token },
  });
  return response.data;
}

export async function followPlaylist(playlistId: string, accessToken: string): Promise<void> {
  await apiClient.put('/follow-playlist', { playlistId, accessToken });
}

export async function likeSong(trackId: string, accessToken: string): Promise<void> {
  await apiClient.put('/like-song', { trackId, accessToken });
}
