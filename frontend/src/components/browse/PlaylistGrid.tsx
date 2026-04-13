import { Skeleton } from '@/components/ui/skeleton';
import { PlaylistCard } from './PlaylistCard';
import type { SpotifyPlaylist } from '@/types/spotify';

interface PlaylistGridProps {
  playlists: SpotifyPlaylist[];
  isLoading: boolean;
  selectedPlaylistId: string | null;
  onSelect: (playlist: SpotifyPlaylist) => void;
  onFollow: (playlistId: string) => void;
  isFollowing: boolean;
}

export function PlaylistGrid({
  playlists,
  isLoading,
  selectedPlaylistId,
  onSelect,
  onFollow,
  isFollowing,
}: PlaylistGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-square rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
        No playlists match your search.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
      {playlists.map((playlist) => (
        <PlaylistCard
          key={playlist.id}
          playlist={playlist}
          isSelected={selectedPlaylistId === playlist.id}
          onSelect={onSelect}
          onFollow={onFollow}
          isFollowing={isFollowing}
        />
      ))}
    </div>
  );
}
