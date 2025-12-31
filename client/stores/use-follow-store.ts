import { api } from '@/lib/api';
import { Artist, FollowArtist, User } from '@/types';
import toast from 'react-hot-toast';
import { create } from 'zustand';

type TargetType = 'users' | 'artists';

interface IFollowProps {
  followedUsers: User[];
  followedArtists: FollowArtist[];
  loading: boolean;
  loadingStatus: boolean;
  loadingTargets: boolean;
  error: string | null;

  followTarget: (
    targetType: TargetType,
    artistId?: number | null,
    target?: string | null
  ) => Promise<void>;
  unfollowTarget: (
    targetType: TargetType,
    artistId?: number | null,
    target?: string | null
  ) => Promise<void>;
  getTargets: (targetType: TargetType) => Promise<void>;
  targetStatus: (
    targetType: TargetType,
    artistId?: number | null,
    target?: string | null
  ) => Promise<boolean>;
}

export const useFollowStore = create<IFollowProps>((set, get) => ({
  followedArtists: [],
  followedUsers: [],
  loading: false,
  loadingStatus: false,
  loadingTargets: false,
  error: null,

  followTarget: async (targetType, artistId, target) => {
    set({ loading: true });

    try {
      if (targetType === 'artists') {
        const {
          data: { success, message },
        } = await api.post('/follow', { target, targetType, artistId });

        if (success) {
          const { getTargets } = get();
          getTargets('artists');
          toast.success(message, { position: 'bottom-center' });
        } else {
          toast.error(message);
        }
      } else {
        const {
          data: { success, message },
        } = await api.post('/follow', { target, targetType });

        success ? toast.success(message) : toast.error(message);
      }
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set({ loading: false });
    }
  },
  unfollowTarget: async (targetType, artistId, target) => {
    try {
      if (targetType === 'artists') {
        const {
          data: { success, message },
        } = await api.delete('/follow/unfollow', {
          params: { targetType, artistId, target },
        });

        if (success) {
          const { getTargets } = get();
          getTargets('artists');
          toast.success(message, { position: 'bottom-center' });
        } else {
          toast.error(message);
        }
      } else {
        const {
          data: { success, message },
        } = await api.post('/follow', { target, targetType });

        success ? toast.success(message) : toast.error(message);
      }
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    }
  },
  getTargets: async (targetType) => {
    set({ loadingTargets: true });
    try {
      if (targetType === 'artists') {
        const {
          data: { success, followedTargets },
        } = await api.get(`/follow/targets/${targetType}`);

        success
          ? set({ followedArtists: followedTargets })
          : set({ followedArtists: [] });
      } else {
        const {
          data: { success, followedTargets },
        } = await api.get(`/follow/targets/${targetType}`);

        success
          ? set({ followedUsers: followedTargets })
          : set({ followedUsers: [] });
      }
    } catch (error: any) {
      set({
        error: error?.response?.data?.message,
        followedArtists: [],
        followedUsers: [],
      });
    } finally {
      set({ loadingTargets: false });
    }
  },
  targetStatus: async (targetType, artistId, target) => {
    set({ loadingStatus: true });
    console.log('Status_store', { targetType, artistId, target });

    try {
      const {
        data: { isFollowed },
      } = await api.get('/follow/status', {
        params: { targetType, artistId, target },
      });

      console.log({ artistId, isFollowed });

      return isFollowed;
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message || error || 'Internal Server Error!',
      });
      return false;
    } finally {
      set({ loadingStatus: false });
    }
  },
}));
