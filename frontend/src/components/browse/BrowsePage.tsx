import { useState, useMemo } from 'react';
import { Separator } from '@/components/ui/separator';
import { SearchBar } from './SearchBar';
import { GenreDropdown } from './GenreDropdown';
import { PlaylistGrid } from './PlaylistGrid';
import { TracklistPanel } from '../tracklist/TracklistPanel';
import { useGenres } from '@/hooks/useGenres';
import { usePlaylists } from '@/hooks/usePlaylists';
import { useFollowPlaylist } from '@/hooks/useFollowPlaylist';
import { useAuth } from '@/context/AuthContext';
import type { SpotifyPlaylist } from '@/types/spotify';

export function BrowsePage() {
  const { accessToken } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedPlaylist, setSelectedPlaylist] = useState<SpotifyPlaylist | null>(null);

  const { data: genres = [] } = useGenres();
  const { data: playlistsData, isLoading: playlistsLoading } = usePlaylists(accessToken);
  const followMutation = useFollowPlaylist(accessToken);

  const allPlaylists = playlistsData?.items ?? [];

  // Genre filter: match genre keyword against playlist name (client-side)
  const filteredPlaylists = useMemo(() => {
    return allPlaylists
      .filter((p) =>
        search
          ? p.name.toLowerCase().includes(search.toLowerCase())
          : true
      )
      .filter((p) =>
        selectedGenre !== 'all'
          ? p.name.toLowerCase().includes(selectedGenre.toLowerCase().replace(/-/g, ' '))
          : true
      );
  }, [allPlaylists, search, selectedGenre]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] h-[calc(100vh-3.5rem)]">
      {/* Left: sticky filters + scrollable playlist grid */}
      <div className="flex flex-col overflow-hidden">
        <div className="flex flex-wrap gap-3 items-center p-6 pb-4 shrink-0">
          <SearchBar value={search} onChange={setSearch} />
          <GenreDropdown
            genres={genres}
            value={selectedGenre}
            onChange={setSelectedGenre}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <PlaylistGrid
            playlists={filteredPlaylists}
            isLoading={playlistsLoading}
            selectedPlaylistId={selectedPlaylist?.id ?? null}
            onSelect={setSelectedPlaylist}
            onFollow={(id) => followMutation.mutate(id)}
            isFollowing={followMutation.isPending}
          />
        </div>
      </div>

      {/* Right: independently scrollable tracklist panel */}
      <div className="border-l hidden lg:flex flex-col overflow-hidden">
        {selectedPlaylist ? (
          <TracklistPanel playlist={selectedPlaylist} />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm p-8 text-center">
            Select a playlist to browse its tracks
          </div>
        )}
      </div>

      {/* Mobile: tracklist as bottom sheet */}
      {selectedPlaylist && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 bg-background border-t shadow-lg max-h-[60vh] overflow-y-auto z-20">
          <Separator />
          <TracklistPanel playlist={selectedPlaylist} />
        </div>
      )}
    </div>
  );
}
