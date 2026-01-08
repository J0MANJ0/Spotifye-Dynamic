import { api } from '@/lib/api';
import type { Message, User } from '@/types';
import { create } from 'zustand';
import { io } from 'socket.io-client';
import { usePlayerStore } from './use-player-store';
import { useSocketStore } from './use-socket-store';

interface ChatStore {
  users: User[];
  loading: boolean;
  socket: any;
  isConnected: boolean;
  onlineUsers: Set<string>;
  usersActivities: Map<string, string>;
  messages: Message[];
  selectedUser: User | null;
  error: string | null;

  initChats: () => void;
  fetchUsers: () => Promise<void>;
  fetchMessages: (userId: string) => Promise<void>;
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
  usersActivities: new Map(),
  selectedUser: null,
  messages: [],
  initChats: () => {
    const { on } = useSocketStore.getState();

    on('users:online', (onlineUsers) => {
      console.log('store', { onlineUsers });
      set({ onlineUsers: new Set(onlineUsers) });
    });

    on('users:online', (data) => {
      console.log({ data });
    });

    on('users:activities', (activities) => {
      set({ usersActivities: new Map(activities) });
    });

    on('user:connected', (userId) => {
      set((state) => ({
        onlineUsers: new Set([...state.onlineUsers, userId]),
      }));
    });

    on('user:disconnected', (userId) => {
      set((state) => {
        const newOnlineUsers = new Set(state.onlineUsers);
        newOnlineUsers.delete(userId);
        return { onlineUsers: newOnlineUsers };
      });
    });

    on('receive:message', (message: Message) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });

    on('sent:message', (message: Message) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });

    on('updated:user:activity', ({ userId, activity }) => {
      set((state) => {
        const newActivities = new Map(state.usersActivities);
        newActivities.set(userId, activity);
        return { usersActivities: newActivities };
      });
    });
  },
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

  sendMessage: (recipientId, senderId, content) => {
    const { emit, isConnected } = useSocketStore.getState();

    if (!isConnected) return;

    emit('send:message', { recipientId, senderId, content });
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
