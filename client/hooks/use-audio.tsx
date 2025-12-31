'use client';

import { useChatStore } from '@/stores/use-chat-store';
import { useMusicStore } from '@/stores/use-music-store';
import { usePlayerStore } from '@/stores/use-player-store';
import { useUser } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';

export const AudioPlayer = () => {
  const audio = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);
  const { user } = useUser();
  const {
    currentTrack,
    currentIndex,
    setCurrentTime,
    setAudioRef,
    isPlaying,
    playNext,
    repeatMode,
    shuffle,
    shuffledQueue,
    likedAlbumPlaying,
    queue,
    progress,
    audioRef,
  } = usePlayerStore();

  const { currentAlbum } = useMusicStore();

  useEffect(() => {
    if (audio.current) {
      setAudioRef(audio.current);
    }
  }, [audio.current]);

  useEffect(() => {
    isPlaying
      ? audioRef?.play().catch((err) => console.log({ err }))
      : audioRef?.pause();

    usePlayerStore.setState({ toastShown: false });
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef || !currentTrack) return;
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
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    const audio = audioRef;
    if (!audio) return;

    const handlePlaying = () => usePlayerStore.setState({ isPlaying: true });
    const handlePause = () => usePlayerStore.setState({ isPlaying: false });
    const handleError = () => usePlayerStore.setState({ isPlaying: false });

    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatMode == 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
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
        const prog = (audio.currentTime / audio.duration) * 100 || 0;
        // Update **only** the store – no socket here
        usePlayerStore.getState().setProgress(prog, audio.currentTime);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []); // run once

  useEffect(() => {
    if (!user?.id) return;
    const socket = useChatStore.getState().socket;

    if (!socket || !socket.connectedg) return;

    const delta: Partial<any> = {
      currentTrack,
      currentAlbum,
      currentIndex,
      currentTime: audioRef?.currentTime ?? 0,
      queue,
      shuffledQueue,
      shuffle,
      repeatMode,
      likedAlbumPlaying,
      progress,
    };
    // Send to server

    usePlayerStore.getState().updateState(delta, user.id);
  }, [
    user?.id,
    currentTrack?._id,
    currentIndex,
    queue,
    shuffledQueue,
    shuffle,
    repeatMode,
    progress,
    likedAlbumPlaying,
  ]);

  // AudioPlayer.tsx

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
          !isPlaying ? audioRef.play() : audioRef.pause();
          break;
        case 'ArrowRight':
          audioRef.currentTime = Math.min(
            audioRef.currentTime + 10,
            audioRef.duration
          );
          break;
        case 'ArrowLeft':
          audioRef.currentTime = Math.max(audioRef.currentTime - 10, 0);
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
