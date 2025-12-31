'use client';

import { useAuthStore } from '@/stores/use-auth-store';
import { useChartStore } from '@/stores/use-chart-store';
import { useChatStore } from '@/stores/use-chat-store';
import { useFollowStore } from '@/stores/use-follow-store';
import { useMusicStore } from '@/stores/use-music-store';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};
const ServerProvider = () => {
  const { user } = useUser();
  const {
    fetchAlbums,
    fetchArtists,
    fetchLikedSongs,
    fetchLrcs,
    fetchMadeForYou,
    fetchTracks,
    createAlbum,
    createLrc,
    createTrack,
    fetchStats,
  } = useMusicStore();
  const { fetchMessages, fetchUsers } = useChatStore();
  const { checkAdmin, getInfo, getUser, isAdmin } = useAuthStore();
  const { getTargets, followTarget, unfollowTarget } = useFollowStore();

  const { fetchChart } = useChartStore();

  useEffect(() => {
    fetchAlbums(), fetchArtists();
    fetchMadeForYou();
    fetchTracks();
    fetchLrcs();
    fetchUsers();
    getTargets('artists');
  }, []);

  useEffect(() => {
    fetchTracks();
    fetchAlbums();
  }, [createAlbum, createLrc, createTrack]);

  useEffect(() => {
    checkAdmin();
  }, [checkAdmin, user]);

  useEffect(() => {
    if (user) {
      fetchMessages(user?.id);
      getInfo();
      getUser();
      fetchChart();
      fetchUsers();
      fetchLikedSongs();
    }
  }, [user, getInfo, getUser, fetchMessages, fetchLikedSongs, fetchChart]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin, user, fetchStats]);

  useEffect(() => {
    getTargets('artists');
  }, [getTargets, followTarget, unfollowTarget]);

  useEffect(() => {
    getTargets('users');
  }, [getTargets, followTarget, unfollowTarget]);

  return null;
};

export default ServerProvider;
