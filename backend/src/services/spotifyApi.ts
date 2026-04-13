import axios, { AxiosError } from 'axios';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

/** Generic wrapper for Spotify API calls. Throws with a clear message on 4xx/5xx. */
export async function spotifyFetch<T>(
  path: string,
  accessToken: string,
  method: 'GET' | 'PUT' | 'DELETE' = 'GET',
  body?: unknown
): Promise<T> {
  try {
    const response = await axios<T>({
      method,
      url: `${SPOTIFY_API_BASE}${path}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: body,
    });
    return response.data;
  } catch (err) {
    const axiosErr = err as AxiosError<{ error?: { message?: string } }>;
    const spotifyMessage = axiosErr.response?.data?.error?.message;
    const status = axiosErr.response?.status ?? 500;
    const message = spotifyMessage ?? axiosErr.message;
    const error = new Error(`Spotify API error (${status}): ${message}`) as Error & { status: number };
    error.status = status;
    throw error;
  }
}
