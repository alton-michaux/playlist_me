import { useMutation, useQueryClient } from '@tanstack/react-query';
import { followPlaylist } from '../api/tracks';
import { useToast } from './use-toast';
import { QUERY_KEYS } from './queryKeys';

export function useFollowPlaylist(accessToken: string | null) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (playlistId: string) => {
      if (!accessToken) throw new Error('Not logged in');
      return followPlaylist(playlistId, accessToken);
    },
    onSuccess: () => {
      // Invalidate playlists so the grid can refresh if needed
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlists(accessToken ?? '') });
      toast({ title: 'Playlist followed!' });
    },
    onError: () => {
      toast({ title: 'Failed to follow playlist', variant: 'destructive' });
    },
  });
}
