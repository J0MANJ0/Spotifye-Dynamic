'use client';

import { useAuthStore } from '@/stores/use-auth-store';
import { usePlayerStore } from '@/stores/use-player-store';
import { useSocketStore } from '@/stores/use-socket-store';
import { Device } from '@/types';
import { useEffect } from 'react';

const PlaybackProvider = () => {
  const { socket, on } = useSocketStore();
  const { syncPlayback, isActive, devices, setActiveDevice } = usePlayerStore();
  const { syncExplicit } = useAuthStore();

  useEffect(() => {
    if (!socket) return;

    const onPlayback = (state: any) => syncPlayback(state);

    on('sync:playback', onPlayback);

    on('sync:explicit', (state) => {
      syncExplicit(state.explicitContent);
    });

    return () => {
      socket.off('sync:playback', onPlayback);

      socket.off('sync:explicit', (state) => {
        syncExplicit(state.explicitContent);
      });
    };
  }, [socket, syncPlayback, syncExplicit]);

  useEffect(() => {
    if (!socket) return;
    const onDevices = ({ devices }: { devices: Device[] }) => {
      usePlayerStore.setState({ devices });
    };

    on('devices:update', onDevices);

    return () => {
      socket.off('devices:update', onDevices);
    };
  }, [socket, devices, setActiveDevice]);

  useEffect(() => {
    if (!socket?.connected) return;

    const onActive = ({ isActiveSocket }: { isActiveSocket: string }) => {
      usePlayerStore.setState({ isActive: isActiveSocket === socket.id });
    };

    on('sync:active', onActive);

    return () => {
      socket.off('sync:active', onActive);
    };
  }, [socket, isActive, devices]);

  return null;
};
export default PlaybackProvider;
