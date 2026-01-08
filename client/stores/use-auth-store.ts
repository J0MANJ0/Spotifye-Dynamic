import { api } from '@/lib/api';
import type { Info, User } from '@/types';
import toast from 'react-hot-toast';
import { create } from 'zustand';
import { useSocketStore } from './use-socket-store';

interface IAuth {
  user: User | null;
  info: Info | null;
  isAdmin: boolean;
  explicitContent: boolean;
  error: string | null;
  loading: boolean;
  loadingExplicit: boolean;
  checkAdmin: () => Promise<void>;
  updateProfile: (formData: object) => Promise<void>;
  toggleExplicitContent: () => Promise<void>;
  getInfo: () => Promise<void>;
  logout: () => void;
  reset: () => void;
  getUser: () => Promise<void>;

  syncExplicit: (state: boolean) => void;
}

export const useAuthStore = create<IAuth>((set) => ({
  user: null,
  info: null,
  explicitContent: true,
  isAdmin: false,
  loading: false,
  loadingExplicit: false,
  error: null,

  checkAdmin: async () => {
    set({ loading: true });
    try {
      const {
        data: { success, admin },
      } = await api.get('/admin/check');
      success ? set({ isAdmin: admin }) : set({ isAdmin: false });
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set({ loading: false });
    }
  },
  logout: () => set({ user: null }),
  getInfo: async () => {
    set({ loading: true });
    try {
      const {
        data: { info },
      } = await api.get('/info/current');
      set({ info });
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set({ loading: false });
    }
  },
  getUser: async () => {
    set({ loading: true });
    try {
      const {
        data: { success, user },
      } = await api.get('/users/user');

      if (success) {
        set({ user, explicitContent: user?.explicitContent });
      } else {
        set({ user: null });
      }
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set({ loading: false });
    }
  },
  toggleExplicitContent: async () => {
    set({ loadingExplicit: true });
    const { emit, socket } = useSocketStore.getState();

    try {
      const {
        data: { success, message, explicitContent },
      } = await api.patch('/users/explicit');

      if (success) {
        set({ explicitContent });
        if (socket) {
          emit('explicit:content:toggle', {
            type: 'TOGGLE_EXPLICIT',
            explicitContent,
          });
        }

        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set({ loadingExplicit: false });
    }
  },
  updateProfile: async (formData) => {
    set({ loading: true });
    try {
      const {
        data: { success, message },
      } = await api.patch('/users/update', formData);

      success ? toast.success(message) : toast.error(message);
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error });
    } finally {
      set({ loading: false });
    }
  },
  reset: () => {
    set({ isAdmin: false, loading: false, error: null });
  },
  syncExplicit: (state) => set({ explicitContent: state }),
}));
