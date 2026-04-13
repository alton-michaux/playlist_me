export const QUERY_KEYS = {
  genres: () => ['genres'] as const,
  playlists: (accessToken: string) => ['playlists', accessToken] as const,
  playlist: (id: string) => ['playlist', id] as const,
  tracklist: (playlistId: string) => ['tracklist', playlistId] as const,
  song: (trackId: string) => ['song', trackId] as const,
} as const;
