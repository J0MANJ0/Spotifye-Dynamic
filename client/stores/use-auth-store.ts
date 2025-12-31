import { api } from '@/lib/api';
import type { Info, User } from '@/types';
import toast from 'react-hot-toast';
import { create } from 'zustand';

interface IAuth {
  user: User | null;
  info: Info | null;
  isAdmin: boolean;
  error: string | null;
  loading: boolean;
  checkAdmin: () => Promise<void>;
  updateProfile: (formData: object) => Promise<void>;
  getInfo: () => Promise<void>;
  logout: () => void;
  reset: () => void;
  getUser: () => Promise<void>;
}

export const useAuthStore = create<IAuth>((set) => ({
  user: null,
  info: null,
  isAdmin: false,
  loading: false,
  error: null,

  checkAdmin: async () => {
    set({ loading: true });
    try {
      const {
        data: { admin },
      } = await api.get('/admin/check');
      set({ isAdmin: admin });
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
        set({ user });
      }
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
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
}));
