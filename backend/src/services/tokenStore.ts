// In-memory store for Spotify refresh tokens, keyed by Spotify user ID.
// Wiped on server restart — user must log in again.
const refreshTokens = new Map<string, string>();

export function storeRefreshToken(userId: string, token: string): void {
  refreshTokens.set(userId, token);
}

export function getRefreshToken(userId: string): string | undefined {
  return refreshTokens.get(userId);
}
