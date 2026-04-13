import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { AudioPreviewPlayer } from './AudioPreviewPlayer';
import { useSong } from '@/hooks/useSong';
import { useLikeSong } from '@/hooks/useLikeSong';
import { useAuth } from '@/context/AuthContext';

interface SongDetailPanelProps {
  trackId: string;
  onClose: () => void;
}

function msToMinutes(ms: number): string {
  const mins = Math.floor(ms / 60000);
  const secs = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  return `${mins}:${secs}`;
}

export function SongDetailPanel({ trackId, onClose }: SongDetailPanelProps) {
  const { accessToken } = useAuth();
  const { data: track, isLoading } = useSong(trackId, accessToken);
  const likeMutation = useLikeSong(accessToken);

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="w-full aspect-square rounded-md" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!track) return null;

  const albumArt = track.album.images[0]?.url;
  const artistNames = track.artists.map((a) => a.name).join(', ');

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-start">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          Track detail
        </span>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 -mt-1 -mr-1">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {albumArt && (
        <img
          src={albumArt}
          alt={track.album.name}
          className="w-full aspect-square object-cover rounded-md"
        />
      )}

      <div className="space-y-1">
        <h3 className="font-semibold text-base leading-tight">{track.name}</h3>
        <p className="text-sm text-muted-foreground">{artistNames}</p>
        <p className="text-xs text-muted-foreground">{track.album.name}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {track.explicit && (
          <Badge variant="secondary" className="text-xs">Explicit</Badge>
        )}
        <Badge variant="outline" className="text-xs">
          {msToMinutes(track.duration_ms)}
        </Badge>
        <Badge variant="outline" className="text-xs">
          Popularity: {track.popularity}
        </Badge>
      </div>

      <Separator />

      <AudioPreviewPlayer previewUrl={track.preview_url} />

      {accessToken && (
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={() => likeMutation.mutate(track.id)}
          disabled={likeMutation.isPending}
        >
          ♥ {likeMutation.isPending ? 'Saving…' : 'Add to Liked Songs'}
        </Button>
      )}
    </div>
  );
}
