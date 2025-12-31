import { api } from '@/lib/api';
import type { Message, User } from '@/types';
import { create } from 'zustand';
import { io } from 'socket.io-client';
import { usePlayerStore } from './use-player-store';

const getDeviceId = () => {
  let id = localStorage.getItem('deviceId');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('deviceId', id);
  }
  return id;
};

interface ChatStore {
  users: User[];
  loading: boolean;
  socket: any;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  messages: Message[];
  selectedUser: User | null;
  error: string | null;

  fetchUsers: () => Promise<void>;
  fetchMessages: (userId: string) => Promise<void>;
  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (recipientId: string, senderId: string, content: string) => void;
  markSeen: (messageId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
}

const baseUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;

const socket = io(baseUrl, {
  autoConnect: false,
  withCredentials: true,
});

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  socket: socket,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  selectedUser: null,
  messages: [],

  fetchUsers: async () => {
    try {
      const {
        data: { users },
      } = await api.get('/users');

      set({ users });
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set({ loading: false });
    }
  },
  initSocket: (userId) => {
    const deviceId = getDeviceId();
    if (!get().isConnected && userId) {
      socket.auth = { userId, deviceId };
      socket.connect();
      socket.emit('user_connected', { userId, deviceId });

      socket.on('pause_due_to_device_switch', () => {
        usePlayerStore.setState({ isPlaying: false });
        const audio = document.querySelector('audio');

        if (audio && !audio.paused) audio.pause();
      });

      socket.on('users_online', (users: string[]) => {
        set({ onlineUsers: new Set(users) });
      });

      const { isPlaying, currentIndex, currentTrack } =
        usePlayerStore.getState();

      socket.emit('sessions', { isPlaying, currentIndex, currentTrack });

      socket.on('activities', (activities: [string, string][]) => {
        set({ userActivities: new Map(activities) });
      });

      socket.on('user_connected', ({ userId }: { userId: string }) => {
        set((state) => ({
          onlineUsers: new Set([...state.onlineUsers, userId]),
        }));
      });

      socket.on('user_disconnected', ({ userId }: { userId: string }) => {
        set((state) => {
          const newOnlineUsers = new Set(state.onlineUsers);
          newOnlineUsers.delete(userId);
          return { onlineUsers: newOnlineUsers };
        });
      });

      socket.on('receive_message', (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });

      socket.on('message_sent', (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });

      socket.on('activity_updated', ({ userId, activity }) => {
        set((state) => {
          const newActivities = new Map(state.userActivities);
          newActivities.set(userId, activity);
          return { userActivities: newActivities };
        });
      });

      set({ isConnected: true });
    }
  },
  disconnectSocket: () => {
    if (get().isConnected) {
      socket.disconnect();
      set({ isConnected: false });
    }
  },
  sendMessage: (recipientId, senderId, content) => {
    const socket = get().socket;
    if (!socket) return;

    socket.emit('send_message', { recipientId, senderId, content });
  },
  fetchMessages: async (userId) => {
    set({ loading: true, error: null });
    try {
      const {
        data: { success, messages },
      } = await api.get(`/users/messages/${userId}`);
      success ? set({ messages }) : set({ messages: [] });
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set({ loading: false });
    }
  },
  markSeen: async (messageId) => {
    const selectedUser = get().selectedUser;

    if (!selectedUser) return;

    set((state) => ({
      messages: state.messages.map((msg) => {
        if (messageId) {
          return msg._id === messageId ? { ...msg, seen: true } : msg;
        }
        return msg.senderId === selectedUser._id ? { ...msg, seen: true } : msg;
      }),
    }));
    try {
      await api.put(`/users/seen/${messageId}`);
    } catch (error: any) {
      set((state) => ({
        messages: state.messages.map((msg) => {
          if (messageId) {
            return msg._id === messageId ? { ...msg, seen: false } : msg;
          }
          return msg.senderId === selectedUser._id
            ? { ...msg, seen: false }
            : msg;
        }),
        error: error.response?.data?.message || 'Failed to mark seen',
      }));
    }
  },
  setSelectedUser: (user) => set({ selectedUser: user }),
}));
