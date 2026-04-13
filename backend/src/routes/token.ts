import { Router, Response } from 'express';
import { getClientCredentialsToken } from '../services/spotifyAuth';

const router = Router();

/** GET /token — returns a Client Credentials access token (no user auth required). */
router.get('/', async (_req, res: Response) => {
  try {
    const { access_token, expires_in } = await getClientCredentialsToken();
    res.json({ access_token, expires_in });
  } catch (err) {
    const error = err as Error & { status?: number };
    res.status(error.status ?? 500).json({ error: error.message });
  }
});

export default router;
