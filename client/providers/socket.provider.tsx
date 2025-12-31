'use client';

import { usePlayerStore } from '@/stores/use-player-store';
import { useSocketStore } from '@/stores/use-socket-store';
import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';

const SocketProvider = () => {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const { currentIndex, currentTrack } = usePlayerStore();

  const {
    socket,
    isConnected,
    initSocket,
    disconnect,
    joinSession,
    leaveSession,
    playTrack,
    pauseTrack,
    seekTrack,
    updateQueue,
    registerDevice,
    setActiveDevice,
    transferPlayback,
    requestSync,
    on,
    off,
    emit,
    activeSession,
    devices,
    currentPlayback,
  } = useSocketStore();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) return;

    const connect = async () => {
      const token = await getToken();
      if (token && userId) {
        initSocket(token, userId);
      }
    };

    connect();
  }, [isLoaded, isSignedIn, userId, getToken, initSocket]);

  useEffect(() => {
    emit('playback:play', { currentIndex, currentTrack });
  }, [emit, currentIndex, currentTrack]);

  return null;
};

export default SocketProvider;
