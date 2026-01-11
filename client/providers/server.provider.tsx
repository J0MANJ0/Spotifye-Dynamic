'use client';

import { useAuthStore } from '@/stores/use-auth-store';
import { useChartStore } from '@/stores/use-chart-store';
import { useChatStore } from '@/stores/use-chat-store';
import { useFollowStore } from '@/stores/use-follow-store';
import { useMusicStore } from '@/stores/use-music-store';

import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

const ServerProvider = () => {
  const { userId } = useAuth();
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
    getUser();
  }, []);

  useEffect(() => {
    checkAdmin();
  }, [checkAdmin, userId]);

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
    if (userId) {
      const fetch = async () => {
        await Promise.all([
          fetchMessages(userId),
          getInfo(),
          fetchChart(),
          fetchUsers(),
          fetchLikedSongs(),
        ]);
      };
      fetch();
    }
  }, [userId, getInfo, fetchMessages, fetchLikedSongs, fetchChart]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin, userId, fetchStats]);

  useEffect(() => {
    if (userId) getTargets('artists');
  }, [getTargets, FollowArtist, unFollowArtist]);

  useEffect(() => {
    if (userId) getTargets('users');
  }, [getTargets, FollowArtist, unFollowArtist]);

  return null;
};

export default ServerProvider;
