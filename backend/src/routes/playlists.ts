import { Router, Request, Response } from 'express';
import { spotifyFetch } from '../services/spotifyApi';
import type {
  SpotifyPlaylist,
  SpotifyPlaylistTrackItem,
  SpotifyPaginatedResponse,
} from '../types/spotify';

const router = Router();

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

/** GET /playlists?token=... — returns the configured user's playlists (up to 50). */
router.get('/', async (req: Request, res: Response) => {
  const { token } = req.query as { token?: string };

  if (!token) {
    res.status(400).json({ error: 'Missing token parameter' });
    return;
  }

  try {
    const userId = getRequiredEnv('SPOTIFY_USER_ID');
    const data = await spotifyFetch<SpotifyPaginatedResponse<SpotifyPlaylist>>(
      `/users/${encodeURIComponent(userId)}/playlists?limit=50`,
      token
    );
    res.json(data);
  } catch (err) {
    const error = err as Error & { status?: number };
    res.status(error.status ?? 500).json({ error: error.message });
  }
});

/** GET /playlist?playlistID=...&token=... — returns a single playlist. */
router.get('/playlist', async (req: Request, res: Response) => {
  const { playlistID, token } = req.query as { playlistID?: string; token?: string };

  if (!playlistID || !token) {
    res.status(400).json({ error: 'Missing playlistID or token parameter' });
    return;
  }

  try {
    const data = await spotifyFetch<SpotifyPlaylist>(
      `/playlists/${encodeURIComponent(playlistID)}`,
      token
    );
    res.json(data);
  } catch (err) {
    const error = err as Error & { status?: number };
    res.status(error.status ?? 500).json({ error: error.message });
  }
});

/** GET /tracklist?playlistID=...&token=... — returns a playlist's tracks. */
router.get('/tracklist', async (req: Request, res: Response) => {
  const { playlistID, token } = req.query as { playlistID?: string; token?: string };

  if (!playlistID || !token) {
    res.status(400).json({ error: 'Missing playlistID or token parameter' });
    return;
  }

  try {
    const data = await spotifyFetch<SpotifyPaginatedResponse<SpotifyPlaylistTrackItem>>(
      `/playlists/${encodeURIComponent(playlistID)}/tracks?limit=100`,
      token
    );
    res.json(data);
  } catch (err) {
    const error = err as Error & { status?: number };
    res.status(error.status ?? 500).json({ error: error.message });
  }
});

export default router;
