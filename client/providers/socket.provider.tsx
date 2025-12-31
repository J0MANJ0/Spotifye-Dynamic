'use client';

import { useSocketStore } from '@/stores/use-socket-store';
import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';

const SocketProvider = () => {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();

  const { initSocket } = useSocketStore();

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

  return null;
};

export default SocketProvider;
