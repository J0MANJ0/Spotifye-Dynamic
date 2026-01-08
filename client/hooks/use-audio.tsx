'use client';

import { skipBackward, skipForward } from '@/lib/utils';
import { useMusicStore } from '@/stores/use-music-store';
import { usePlayerStore } from '@/stores/use-player-store';
import { useUser } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';

export const AudioPlayer = () => {
  const audio = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);
  const { user } = useUser();
  const {
    currentTrackId,
    currentTime,
    setCurrentTime,
    requestSeek,
    setAudioRef,
    isPlaying,
    playNext,
    isActive,
    repeatMode,
    audioRef,
  } = usePlayerStore();

  const { tracksByIds } = useMusicStore();

  const currentTrack = tracksByIds[currentTrackId!];

  useEffect(() => {
    if (!audioRef) return;

    audioRef.currentTime = currentTime;
    requestSeek(currentTime);
  }, [audioRef, audio, requestSeek]);

  useEffect(() => {
    if (audio?.current) {
      setAudioRef(audio?.current);
    }
  }, [audio?.current, setAudioRef, isActive]);

  useEffect(() => {
    isPlaying
      ? audioRef?.play().catch((err) => console.log({ err }))
      : audioRef?.pause();

    usePlayerStore.setState({ toastShown: false });
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef || !currentTrackId) return;
    const audio = audioRef;

    let isLoading = false;
    const isSongChange = prevSongRef.current !== currentTrack?.audioUrl;

    if (isSongChange && !isLoading) {
      isLoading = true;
      audio.src = currentTrack?.audioUrl;
      audio.currentTime = 0;
      prevSongRef.current = currentTrack?.audioUrl;

      if (isPlaying) {
        audio.onloadedmetadata = () => {
          audio
            .play()
            .catch((error) => {
              console.error('Playback failed:', error);
            })
            .finally(() => {
              isLoading = false;
            });
        };
      } else {
        isLoading = false;
      }
    }
  }, [currentTrackId, isPlaying]);

  useEffect(() => {
    const audio = audioRef;
    if (!audio) return;

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [repeatMode, playNext]);

  useEffect(() => {
    const audio = audioRef;
    if (!audio) return;

    let raf: number;
    const tick = () => {
      if (!audio.paused) {
        const prog = (currentTime / audio.duration) * 100 || 0;
        // Update **only** the store – no socket here
        usePlayerStore.getState().setProgress(prog);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []); // run once

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (!audioRef) return;

      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (isTyping) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          audioRef.paused ? audioRef.play() : audioRef.pause();
          break;
        case 'ArrowRight':
          audioRef.currentTime = skipForward();
          break;
        case 'ArrowLeft':
          audioRef.currentTime = skipBackward();
          break;
      }
    };

    window.addEventListener('keydown', keyDown);

    return () => window.removeEventListener('keydown', keyDown);
  }, []);

  return (
    <audio
      ref={audio}
      onTimeUpdate={(e) =>
        setCurrentTime((e.target as HTMLAudioElement).currentTime)
      }
    />
  );
};
