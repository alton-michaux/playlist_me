import { Router, Request, Response } from 'express';
import { spotifyFetch } from '../services/spotifyApi';

const router = Router();

interface GenreSeedsResponse {
  genres: string[];
}

/** GET /genres?token=... — returns available Spotify genre seeds. */
router.get('/', async (req: Request, res: Response) => {
  const { token } = req.query as { token?: string };

  if (!token) {
    res.status(400).json({ error: 'Missing token parameter' });
    return;
  }

  try {
    const data = await spotifyFetch<GenreSeedsResponse>(
      '/recommendations/available-genre-seeds',
      token
    );
    res.json(data);
  } catch (err) {
    const error = err as Error & { status?: number };
    res.status(error.status ?? 500).json({ error: error.message });
  }
});

export default router;
