import { Router, Request, Response } from 'express';
import { spotifyFetch } from '../services/spotifyApi';
import type { SpotifyTrack } from '../types/spotify';

const router = Router();

/** GET /song?trackID=...&token=... — returns track details. */
router.get('/', async (req: Request, res: Response) => {
  const { trackID, token } = req.query as { trackID?: string; token?: string };

  if (!trackID || !token) {
    res.status(400).json({ error: 'Missing trackID or token parameter' });
    return;
  }

  try {
    const data = await spotifyFetch<SpotifyTrack>(
      `/tracks/${encodeURIComponent(trackID)}`,
      token
    );
    res.json(data);
  } catch (err) {
    const error = err as Error & { status?: number };
    res.status(error.status ?? 500).json({ error: error.message });
  }
});

export default router;
