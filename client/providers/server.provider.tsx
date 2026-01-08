'use client';

import { useAuthStore } from '@/stores/use-auth-store';
import { useChartStore } from '@/stores/use-chart-store';
import { useChatStore } from '@/stores/use-chat-store';
import { useFollowStore } from '@/stores/use-follow-store';
import { useMusicStore } from '@/stores/use-music-store';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

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
  const { getTargets, FollowArtist, unFollowArtist } = useFollowStore();

  const { fetchChart } = useChartStore();

  useEffect(() => {
    const fetch = async () => {
      return await Promise.all([
        fetchAlbums(),
        fetchArtists(),
        fetchMadeForYou(),
        fetchTracks(),
        fetchUsers(),
        getTargets('artists'),
      ]);
    };
    fetch();
    getTargets('artists');
  }, []);

  useEffect(() => {
    const fetch = async () => {
      return await Promise.all([fetchAlbums(), fetchTracks()]);
    };
    fetch();
  }, [createAlbum, createLrc, createTrack]);

  useEffect(() => {
    checkAdmin();
  }, [checkAdmin, user]);

  useEffect(() => {
    if (user) {
      const fetch = async () => {
        return await Promise.all([
          fetchMessages(user?.id),
          getInfo(),
          getUser(),
          fetchChart(),
          fetchUsers(),
          fetchLikedSongs(),
        ]);
      };
      fetch();
    }
  }, [user, getInfo, getUser, fetchMessages, fetchLikedSongs, fetchChart]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin, user, fetchStats]);

  useEffect(() => {
    getTargets('artists');
  }, [getTargets, FollowArtist, unFollowArtist]);

  useEffect(() => {
    getTargets('users');
  }, [getTargets, FollowArtist, unFollowArtist]);

  return null;
};

export default ServerProvider;
