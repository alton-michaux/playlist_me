import { useQuery } from '@tanstack/react-query';
import { getTracklist } from '../api/playlists';
import { QUERY_KEYS } from './queryKeys';

export function useTracklist(playlistId: string | null, token: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.tracklist(playlistId ?? ''),
    queryFn: () => getTracklist(playlistId!, token!),
    enabled: !!playlistId && !!token,
  });
}
