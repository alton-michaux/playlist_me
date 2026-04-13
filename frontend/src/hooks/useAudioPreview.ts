import { useRef, useState, useEffect } from 'react';

type PlaybackState = 'idle' | 'playing' | 'paused';

export function useAudioPreview() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlaybackState>('idle');
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  // Stop and clean up audio on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  function play(url: string) {
    if (!url) return;

    if (currentUrl === url && audioRef.current) {
      // Resume paused clip
      void audioRef.current.play();
      setState('playing');
      return;
    }

    // Stop any currently playing clip
    audioRef.current?.pause();

    const audio = new Audio(url);
    audioRef.current = audio;
    setCurrentUrl(url);

    audio.addEventListener('ended', () => setState('idle'));
    audio.addEventListener('error', () => setState('idle'));

    void audio.play();
    setState('playing');
  }

  function pause() {
    audioRef.current?.pause();
    setState('paused');
  }

  function stop() {
    audioRef.current?.pause();
    audioRef.current = null;
    setCurrentUrl(null);
    setState('idle');
  }

  return { state, currentUrl, play, pause, stop };
}
