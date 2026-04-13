import { Router, Request, Response } from 'express';
import {
  buildAuthUrl,
  exchangeCode,
  refreshAccessToken,
  getUserProfile,
} from '../services/spotifyAuth';
import { consumeState } from '../services/stateStore';
import { storeRefreshToken, getRefreshToken } from '../services/tokenStore';

const router = Router();

/** GET /login — returns the Spotify auth URL; frontend navigates to it. */
router.get('/login', (_req, res: Response) => {
  try {
    const url = buildAuthUrl();
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * GET /callback?code=...&state=...
 * Validates state, exchanges code for tokens, stores refresh token, returns user profile.
 */
router.get('/callback', async (req: Request, res: Response) => {
  const { code, state } = req.query as { code?: string; state?: string };

  if (!code || !state) {
    res.status(400).json({ error: 'Missing code or state parameter' });
    return;
  }

  if (!consumeState(state)) {
    res.status(400).json({ error: 'state_mismatch' });
    return;
  }

  try {
    const tokens = await exchangeCode(code);
    const user = await getUserProfile(tokens.access_token);

    if (tokens.refresh_token) {
      storeRefreshToken(user.id, tokens.refresh_token);
    }

    res.json({
      user,
      access_token: tokens.access_token,
      expires_in: tokens.expires_in,
    });
  } catch (err) {
    const error = err as Error & { status?: number };
    res.status(error.status ?? 500).json({ error: error.message });
  }
});

/**
 * GET /refresh?userId=...
 * Exchanges the stored refresh token for a new access token.
 */
router.get('/refresh', async (req: Request, res: Response) => {
  const { userId } = req.query as { userId?: string };

  if (!userId) {
    res.status(400).json({ error: 'Missing userId parameter' });
    return;
  }

  const storedRefreshToken = getRefreshToken(userId);
  if (!storedRefreshToken) {
    res.status(401).json({ error: 'No refresh token found for this user — please log in again' });
    return;
  }

  try {
    const tokens = await refreshAccessToken(storedRefreshToken);

    // Spotify may issue a new refresh token on each refresh
    if (tokens.refresh_token) {
      storeRefreshToken(userId, tokens.refresh_token);
    }

    res.json({
      access_token: tokens.access_token,
      expires_in: tokens.expires_in,
    });
  } catch (err) {
    const error = err as Error & { status?: number };
    res.status(error.status ?? 500).json({ error: error.message });
  }
});

export default router;
