import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { getLoginUrl } from '@/api/auth';

const FEATURED_GENRES = [
  'jazz', 'hip-hop', 'r-n-b', 'soul', 'funk',
  'indie', 'electronic', 'classical', 'latin', 'reggae',
];

export function LandingPage() {
  const [loginUrl, setLoginUrl] = useState<string | null>(null);

  useEffect(() => {
    getLoginUrl()
      .then(setLoginUrl)
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col items-center px-4 pt-20 pb-16 gap-12">
      {/* Hero */}
      <div className="text-center max-w-2xl gap-6 flex flex-col">
        <h1 className="text-5xl font-bold tracking-tight">
          playlist_me
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed">
          Browse curated Spotify playlists by genre, preview tracks, and
          save your favorites — all in one place.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a
            href={loginUrl ?? '#'}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-semibold transition-colors text-sm"
          >
            Log in with Spotify
          </a>
        </div>
      </div>

      {/* Genre highlights */}
      <div className="w-full max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground mb-4 text-center uppercase tracking-wider">
          Explore by genre
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {FEATURED_GENRES.map((genre) => (
            <Badge key={genre} variant="secondary" className="text-sm px-3 py-1 capitalize cursor-default">
              {genre.replace(/-/g, ' ')}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
