import { Router, Request, Response } from 'express';
import { spotifyFetch } from '../services/spotifyApi';

const router = Router();

/**
 * PUT /follow-playlist
 * Body: { playlistId: string, accessToken: string }
 * Follows the given playlist for the authenticated user.
 */
router.put('/follow-playlist', async (req: Request, res: Response) => {
  const { playlistId, accessToken } = req.body as {
    playlistId?: string;
    accessToken?: string;
  };

  if (!playlistId || !accessToken) {
    res.status(400).json({ error: 'Missing playlistId or accessToken in request body' });
    return;
  }

  try {
    // Spotify returns 200 with empty body on success
    await spotifyFetch(
      `/playlists/${encodeURIComponent(playlistId)}/followers`,
      accessToken,
      'PUT',
      { public: false }
    );
    res.json({ success: true });
  } catch (err) {
    const error = err as Error & { status?: number };
    res.status(error.status ?? 500).json({ error: error.message });
  }
});

/**
 * PUT /like-song
 * Body: { trackId: string, accessToken: string }
 * Adds the track to the authenticated user's Liked Songs.
 */
router.put('/like-song', async (req: Request, res: Response) => {
  const { trackId, accessToken } = req.body as {
    trackId?: string;
    accessToken?: string;
  };

  if (!trackId || !accessToken) {
    res.status(400).json({ error: 'Missing trackId or accessToken in request body' });
    return;
  }

  try {
    await spotifyFetch(
      `/me/tracks`,
      accessToken,
      'PUT',
      { ids: [trackId] }
    );
    res.json({ success: true });
  } catch (err) {
    const error = err as Error & { status?: number };
    res.status(error.status ?? 500).json({ error: error.message });
  }
});

export default router;
