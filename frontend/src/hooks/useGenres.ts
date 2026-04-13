import { useQuery } from '@tanstack/react-query';
import { getGenres } from '../api/playlists';
import { QUERY_KEYS } from './queryKeys';

export function useGenres(token: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.genres(),
    queryFn: () => getGenres(token!),
    enabled: !!token,
  });
}
