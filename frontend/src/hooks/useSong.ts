import { useQuery } from '@tanstack/react-query';
import { getSong } from '../api/tracks';
import { QUERY_KEYS } from './queryKeys';

export function useSong(trackId: string | null, token: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.song(trackId ?? ''),
    queryFn: () => getSong(trackId!, token!),
    enabled: !!trackId && !!token,
  });
}
