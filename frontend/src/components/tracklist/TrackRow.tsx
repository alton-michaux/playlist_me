import { Play, Pause, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SpotifyTrack } from '@/types/spotify';

interface TrackRowProps {
  track: SpotifyTrack;
  index: number;
  isSelected: boolean;
  isPlaying: boolean;
  onSelect: (trackId: string) => void;
  onPlayPause: (previewUrl: string | null) => void;
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
  isPlaying,
  onSelect,
  onPlayPause,
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
      {/* Index / play indicator */}
      <span className="w-5 text-xs text-muted-foreground text-right shrink-0 group-hover:hidden">
        {index + 1}
      </span>

      {/* Play/pause button — visible on hover */}
      <Button
        variant="ghost"
        size="icon"
        className="w-5 h-5 p-0 hidden group-hover:flex shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onPlayPause(track.preview_url);
        }}
        disabled={!track.preview_url}
        title={track.preview_url ? 'Preview' : 'No preview available'}
      >
        {isPlaying ? (
          <Pause className="w-3 h-3" />
        ) : (
          <Play className="w-3 h-3" />
        )}
      </Button>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${isSelected ? 'font-medium' : ''}`}>{track.name}</p>
        <p className="text-xs text-muted-foreground truncate">{artistNames}</p>
      </div>

      {/* Duration */}
      <span className="text-xs text-muted-foreground shrink-0">
        {msToMinutes(track.duration_ms)}
      </span>

      {/* Like button */}
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
