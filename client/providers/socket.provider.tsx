'use client';

import { useChatStore } from '@/stores/use-chat-store';
import { useSocketStore } from '@/stores/use-socket-store';
import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';

const SocketProvider = () => {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();

  const { initSocket, disconnect, isConnected } = useSocketStore();

  const { initChats } = useChatStore();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) return;

    const connect = async () => {
      const token = await getToken();
      if (token && userId) {
        initSocket(userId);
      } else {
        disconnect();
      }
    };

    connect();

    return () => disconnect();
  }, [isLoaded, isSignedIn, userId, getToken, initSocket]);

  useEffect(() => {
    if (isConnected) {
      initChats();
    }
  }, [isConnected, initChats]);

  return null;
};

export default SocketProvider;
