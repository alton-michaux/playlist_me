import { useMutation } from '@tanstack/react-query';
import { likeSong } from '../api/tracks';
import { useToast } from './use-toast';

export function useLikeSong(accessToken: string | null) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (trackId: string) => {
      if (!accessToken) throw new Error('Not logged in');
      return likeSong(trackId, accessToken);
    },
    onSuccess: () => {
      toast({ title: 'Added to Liked Songs!' });
    },
    onError: () => {
      toast({ title: 'Failed to like song', variant: 'destructive' });
    },
  });
}
