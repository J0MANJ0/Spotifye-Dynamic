import { useAuth } from '@clerk/nextjs';
import type { InternalAxiosRequestConfig } from 'axios';
import { useEffect } from 'react';
import { api } from '@/lib/api';

export const useAuthInterceptor = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const interceptor = api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await getToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      }
    );

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [getToken]);
};
