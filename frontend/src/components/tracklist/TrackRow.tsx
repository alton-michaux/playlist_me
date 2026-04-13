import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SpotifyTrack } from '@/types/spotify';

interface TrackRowProps {
  track: SpotifyTrack;
  index: number;
  isSelected: boolean;
  onSelect: (trackId: string) => void;
  onLike: (trackId: string) => void;
  isLiking: boolean;
}

function msToMinutes(ms: number): string {
  const mins = Math.floor(ms / 60000);
  const secs = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  return `${mins}:${secs}`;
}

export function TrackRow({
  track,
  index,
  isSelected,
  onSelect,
  onLike,
  isLiking,
}: TrackRowProps) {
  const artistNames = track.artists.map((a) => a.name).join(', ');

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors cursor-pointer group ${
        isSelected ? 'bg-accent' : ''
      }`}
      onClick={() => onSelect(track.id)}
    >
      <span className="w-5 text-xs text-muted-foreground text-right shrink-0">
        {index + 1}
      </span>

      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${isSelected ? 'font-medium' : ''}`}>{track.name}</p>
        <p className="text-xs text-muted-foreground truncate">{artistNames}</p>
      </div>

      <span className="text-xs text-muted-foreground shrink-0">
        {msToMinutes(track.duration_ms)}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onLike(track.id);
        }}
        disabled={isLiking}
        title="Add to Liked Songs"
      >
        <Heart className="w-3 h-3" />
      </Button>
    </div>
  );
}
