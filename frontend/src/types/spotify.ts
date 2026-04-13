export interface SpotifyUserProfile {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string; width: number | null; height: number | null }>;
  country: string;
  product: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  external_urls: { spotify: string };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: Array<{ url: string; width: number | null; height: number | null }>;
  external_urls: { spotify: string };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  preview_url: string | null;
  duration_ms: number;
  explicit: boolean;
  popularity: number;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  external_urls: { spotify: string };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string | null;
  public: boolean | null;
  images: Array<{ url: string; width: number | null; height: number | null }>;
  tracks: { total: number; href: string };
  owner: { id: string; display_name: string };
  external_urls: { spotify: string };
}

export interface SpotifyPlaylistTrackItem {
  added_at: string;
  track: SpotifyTrack | null;
}

export interface SpotifyPaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}
