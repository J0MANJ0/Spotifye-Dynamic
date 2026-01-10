'use client';

import { skipBackward, skipForward } from '@/lib/utils';
import { useMusicStore } from '@/stores/use-music-store';
import { usePlayerStore } from '@/stores/use-player-store';
import { useEffect, useRef } from 'react';

export const AudioPlayer = () => {
  const audio = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);
  const {
    currentTrackId,
    currentTime,
    setCurrentTime,
    requestSeek,
    setAudioRef,
    isPlaying,
    playNext,
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
  }, []);

  useEffect(() => {
    isPlaying
      ? audioRef?.play().catch((err) => console.log({ err }))
      : audioRef?.pause();

    usePlayerStore.setState({ toastShown: false });
  }, [isPlaying]);

  useEffect(() => {
    const audioEl = audio.current;
    if (!audioEl || !currentTrack?.audioUrl) return;

    if (prevSongRef.current === currentTrack.audioUrl) return;

    prevSongRef.current = currentTrack.audioUrl;

    audioEl.src = currentTrack.audioUrl;
    audioEl.load();
    audioEl.currentTime = 0;

    if (isPlaying) {
      audioEl.play().catch((err) => {
        console.error('Playback failed:', err);
      });
    }
  }, [currentTrackId]);

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
