'use client';

import { api } from '@/lib/api';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuthInterceptor } from './auth-interceptor';
import { useAuthStore } from '@/stores/use-auth-store';
import { useAuth } from '@clerk/nextjs';
import { useSocketStore } from '@/stores/use-socket-store';

type Props = {
  children: React.ReactNode;
};

const updateApiToken = (token: string | null) => {
  token
    ? (api.defaults.headers.common['Authorization'] = `Bearer ${token}`)
    : delete api.defaults.headers.common['Authorization'];
};

const AuthProvider = ({ children }: Props) => {
  const { getToken, userId } = useAuth();
  const [loading, setLoading] = useState(false);
  const { checkAdmin, getUser, logout } = useAuthStore();
  const { initSocket, disconnect } = useSocketStore();

  useAuthInterceptor();
  useEffect(() => {
    const setupAuthAndSocket = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        updateApiToken(token);

        if (token) await checkAdmin();

        if (userId && token) {
          initSocket(token, userId);
          getUser(); // ensure socket connection
        } else {
          logout();
        }
      } catch (error: any) {
        updateApiToken(null);
        console.error('Error in AuthProvider:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) setupAuthAndSocket();

    return () => disconnect();
  }, [userId]);

  if (loading)
    return (
      <div className='h-screen w-full flex items-center justify-center'>
        <Loader className='size-8 text-emerald-500 animate-spin' />
      </div>
    );

  return <>{children}</>;
};
export default AuthProvider;
