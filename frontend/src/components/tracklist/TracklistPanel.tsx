import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { TrackRow } from './TrackRow';
import { SongDetailPanel } from '../song/SongDetailPanel';
import { useTracklist } from '@/hooks/useTracklist';
import { useLikeSong } from '@/hooks/useLikeSong';
import { useAudioPreview } from '@/hooks/useAudioPreview';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import type { SpotifyPlaylist } from '@/types/spotify';

interface TracklistPanelProps {
  playlist: SpotifyPlaylist;
}

export function TracklistPanel({ playlist }: TracklistPanelProps) {
  const { accessToken } = useAuth();
  const { data, isLoading } = useTracklist(playlist.id, accessToken);
  const likeMutation = useLikeSong(accessToken);
  const audio = useAudioPreview();
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  const tracks = data?.items
    .map((item) => item.track)
    .filter((t): t is NonNullable<typeof t> => t !== null) ?? [];

  return (
    <div className="flex flex-col h-full">
      {/* Playlist header */}
      <div className="p-4 pb-2">
        <h2 className="font-semibold text-base truncate">{playlist.name}</h2>
        <p className="text-xs text-muted-foreground">{playlist.tracks.total} tracks</p>
      </div>
      <Separator />

      {/* Song detail panel (when a track is selected) */}
      {selectedTrackId && (
        <>
          <SongDetailPanel
            trackId={selectedTrackId}
            onClose={() => setSelectedTrackId(null)}
          />
          <Separator />
        </>
      )}

      {/* Track list */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="space-y-1 p-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex gap-3 items-center px-3 py-2">
                <Skeleton className="w-5 h-4" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="w-8 h-4" />
              </div>
            ))}
          </div>
        ) : (
          tracks.map((track, index) => {
            const isPlaying =
              audio.currentUrl === track.preview_url &&
              audio.state === 'playing';

            return (
              <TrackRow
                key={track.id}
                track={track}
                index={index}
                isSelected={selectedTrackId === track.id}
                isPlaying={isPlaying}
                onSelect={setSelectedTrackId}
                onPlayPause={(url) => {
                  if (!url) return;
                  isPlaying ? audio.pause() : audio.play(url);
                }}
                onLike={(id) => likeMutation.mutate(id)}
                isLiking={likeMutation.isPending}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
