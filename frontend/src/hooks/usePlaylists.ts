import { useQuery } from '@tanstack/react-query';
import { getUserPlaylists } from '../api/playlists';
import { QUERY_KEYS } from './queryKeys';

export function usePlaylists(token: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.playlists(token ?? ''),
    queryFn: () => getUserPlaylists(token!),
    enabled: !!token,
  });
}
