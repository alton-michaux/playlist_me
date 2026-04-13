import { Play, Pause, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioPreview } from '@/hooks/useAudioPreview';

interface AudioPreviewPlayerProps {
  previewUrl: string | null;
}

export function AudioPreviewPlayer({ previewUrl }: AudioPreviewPlayerProps) {
  const { state, currentUrl, play, pause } = useAudioPreview();

  const isThisTrack = currentUrl === previewUrl;
  const isPlaying = isThisTrack && state === 'playing';

  if (!previewUrl) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Music className="w-4 h-4" />
        <span>No preview available</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => (isPlaying ? pause() : play(previewUrl))}
        className="gap-2"
      >
        {isPlaying ? (
          <>
            <Pause className="w-4 h-4" /> Pause preview
          </>
        ) : (
          <>
            <Play className="w-4 h-4" /> Play preview
          </>
        )}
      </Button>
      <span className="text-xs text-muted-foreground">30s clip</span>
    </div>
  );
}
