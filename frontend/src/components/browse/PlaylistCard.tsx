import { UserPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { SpotifyPlaylist } from '@/types/spotify';

interface PlaylistCardProps {
  playlist: SpotifyPlaylist;
  isSelected: boolean;
  onSelect: (playlist: SpotifyPlaylist) => void;
  onFollow: (playlistId: string) => void;
  isFollowing: boolean;
}

export function PlaylistCard({
  playlist,
  isSelected,
  onSelect,
  onFollow,
  isFollowing,
}: PlaylistCardProps) {
  const coverUrl = playlist.images[0]?.url;

  return (
    <Card
      className={`cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all group ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => onSelect(playlist)}
    >
      {/* Cover image */}
      <div className="aspect-square bg-muted overflow-hidden rounded-t-md">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={playlist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <span className="text-3xl">♪</span>
          </div>
        )}
      </div>

      <CardContent className="p-3 space-y-2">
        <p className="text-sm font-medium leading-tight line-clamp-2">{playlist.name}</p>

        <div className="flex items-center justify-between gap-1">
          <Badge variant="secondary" className="text-xs">
            {playlist.tracks.total} tracks
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onFollow(playlist.id);
            }}
            disabled={isFollowing}
            title="Follow playlist"
          >
            <UserPlus className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
