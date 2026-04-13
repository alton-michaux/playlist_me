import { apiClient } from './client';
import type {
  SpotifyPaginatedResponse,
  SpotifyPlaylist,
  SpotifyPlaylistTrackItem,
} from '../types/spotify';

export async function getGenres(token: string): Promise<string[]> {
  const response = await apiClient.get<{ genres: string[] }>('/genres', {
    params: { token },
  });
  return response.data.genres;
}

export async function getUserPlaylists(token: string): Promise<SpotifyPaginatedResponse<SpotifyPlaylist>> {
  const response = await apiClient.get<SpotifyPaginatedResponse<SpotifyPlaylist>>('/playlists', {
    params: { token },
  });
  return response.data;
}

export async function getPlaylist(playlistID: string, token: string): Promise<SpotifyPlaylist> {
  const response = await apiClient.get<SpotifyPlaylist>('/playlists/playlist', {
    params: { playlistID, token },
  });
  return response.data;
}

export async function getTracklist(
  playlistID: string,
  token: string
): Promise<SpotifyPaginatedResponse<SpotifyPlaylistTrackItem>> {
  const response = await apiClient.get<SpotifyPaginatedResponse<SpotifyPlaylistTrackItem>>(
    '/playlists/tracklist',
    { params: { playlistID, token } }
  );
  return response.data;
}
