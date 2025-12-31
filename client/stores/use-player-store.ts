import type { Album, Track } from '@/types';
import { create } from 'zustand';
import { useChatStore } from './use-chat-store';
import { useAuthStore } from './use-auth-store';
import { getDeviceId } from '@/lib/deviceId';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';
import { useMusicStore } from './use-music-store';
import { useSocketStore } from './use-socket-store';

type RepeatMode = 'off' | 'all' | 'one';

let isApplyingRemote: boolean = false;

interface Device {
  id: string;
  name: string;
}

interface Props {
  currentTrack: Track | null;
  isPlaying: boolean;
  shuffle: boolean;
  shuffledQueue: Track[];
  queue: Track[];
  likedAlbumPlaying: boolean;
  artistAlbumPlaying: boolean;
  madeForYouAlbumPlaying: boolean;
  currentIndex: number;
  currentTime: number;
  repeatMode: RepeatMode;
  progress: number;
  toastShown: boolean;
  audioRef: HTMLAudioElement | null;
  minSize: number;
  isMaxRight: boolean;
  isMaxLeft: boolean;
  userId: string | null;

  setAudioRef: (ref: HTMLAudioElement) => void;
  seekTo: (time: number) => void;
  initializeSocketListeners: (
    userId: string,
    deviceName: string
  ) => Promise<void>;
  getSessions: () => Promise<void>;
  updateState: (delta: Partial<Props> | object, userId: string | null) => void;
  setToastShown: (value: boolean) => void;
  setProgress: (progress: number, currentTime: number) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  setCurrentTime: (currentTime: number) => void;
  togglRepeatMode: () => void;
  toggleShuffle: () => void;

  initializeQueue: (songs: Track[]) => void;
  playAlbum: (songs: Track[], startIndex?: number) => void;

  setcurrentTrack: (track: Track | null) => void;
  toggleSong: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const usePlayerStore = create<Props>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  currentTime: 0,
  repeatMode: 'off',
  likedAlbumPlaying: false,
  artistAlbumPlaying: false,
  madeForYouAlbumPlaying: false,
  shuffle: false,
  shuffledQueue: [],
  minSize: 25,
  progress: 0,
  isMaxRight: true,
  isMaxLeft: true,
  audioRef: null,
  toastShown: false,

  userId: null,

  initializeSocketListeners: async (userId) => {
    const { socket } = useChatStore.getState();
    if (!socket) return;

    set({ userId });

    socket.emit('user_connected', { userId });

    socket.emit('register_device', { userId });

    socket.on('resume_music_state', (savedState: any) => {
      isApplyingRemote = true;
      set({
        ...savedState,
      });

      if (savedState.currentAlbum) {
        useMusicStore.setState({ currentAlbum: savedState.currentAlbum });
      }

      setTimeout(() => (isApplyingRemote = false), 50);
    });
  },
  updateState: (delta, userId) => {
    const { socket } = useChatStore.getState();
    const { user } = useAuthStore.getState();

    if (user) return;

    if (!socket || !userId || !delta) return;

    if (typeof isApplyingRemote !== 'undefined' && isApplyingRemote) return;

    socket.emit('update_music_state', {
      userId,
      delta,
    });

    return () => {
      socket.off('update_music_state');
      socket.off('music_state_updated');
    };
  },
  getSessions: async () => {
    const { socket } = useSocketStore.getState();

    if (!socket?.connected) return;

    socket.on('resume_state', (states) => {
      console.log(states);
    });
  },
  setAudioRef: (ref) => set({ audioRef: ref }),
  seekTo: (time) => {
    const audio = get().audioRef;

    if (!audio) return;

    audio.currentTime = time;
  },
  setToastShown: (toastShown) => set({ toastShown }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setProgress: (progress, currentTime) => {
    const { userId } = get();
    const { socket } = useChatStore.getState();
    const { user } = useAuthStore.getState();

    if (user) return;

    set({ progress, currentTime });
  },
  setRepeatMode: (value) => {
    const { user } = useAuthStore.getState();

    if (!user) return;
    set({ repeatMode: value });
  },
  togglRepeatMode: () => {
    const { repeatMode } = get();
    const { user } = useAuthStore.getState();

    if (!user) return;

    const nextMode =
      repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off';

    set({ repeatMode: nextMode });
  },

  toggleShuffle: () => {
    const { shuffle, queue, currentTrack } = get();
    const { user } = useAuthStore.getState();

    if (!user) return;

    if (!shuffle) {
      const shuffled = [...queue];

      // fisher-yates shuffle method

      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      if (currentTrack) {
        const idx = shuffled.findIndex((s) => s._id === currentTrack._id);

        if (idx > -1) {
          [shuffled[0], shuffled[idx]] = [shuffled[idx], shuffled[0]];
        }
      }

      set({
        shuffle: true,
        shuffledQueue: shuffled,
        currentIndex: 0,
        currentTrack: shuffled[0],
      });
    } else {
      const currentIndex = currentTrack
        ? queue.findIndex((s) => s._id === currentTrack._id)
        : 0;

      set({
        shuffle: false,
        shuffledQueue: [],
        currentIndex,
      });
    }
  },
  initializeQueue: (songs) => {
    set({
      queue: songs,
      currentTrack: get().currentTrack || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },
  playAlbum: (tracks, startIndex = 0) => {
    if (tracks.length === 0) return;

    const track = tracks[startIndex];

    const { socket } = useChatStore.getState();

    if (socket.auth) {
      socket.emit('update_activity', {
        userId: socket.auth.userId,
        activity: `Playing ${track.data.title} by ${track.data.artist.name}`,
      });
    }

    set({
      queue: tracks,
      currentIndex: startIndex,
      currentTrack: track,
      isPlaying: true,
    });
  },
  setcurrentTrack: (track) => {
    if (!track) return;

    const songIdx = get().queue.findIndex((s) => s._id === track._id);

    set({
      currentTrack: track,
      isPlaying: true,
      currentIndex: songIdx !== -1 ? songIdx : get().currentIndex,
    });
    const { socket } = useChatStore.getState();

    if (socket.auth) {
      socket.emit('update_activity', {
        userId: socket.auth.userId,
        activity: `Playing ${track.data.title} by ${track.data.artist.name}`,
      });
    }
  },
  toggleSong: () => {
    const { currentTrack, isPlaying, userId } = get();

    const newState = !isPlaying;

    set({
      isPlaying: newState,
    });
    const socket = useChatStore.getState().socket;

    if (socket.auth) {
      socket.emit('update_activity', {
        userId: socket.auth.userId,
        activity:
          newState && currentTrack
            ? `Playing ${currentTrack.data.title} by ${currentTrack.data.artist.name}`
            : 'Idle',
      });

      socket.emit('update_music_state', {
        userId,
        delta: { isPlaying: newState },
      });
    }
  },
  playNext: debounce(() => {
    const {
      currentIndex,
      queue,
      repeatMode,
      currentTrack,
      shuffle,
      shuffledQueue,
    } = get();

    set({ toastShown: false });

    if (repeatMode === 'one' && currentTrack) {
      const { socket } = useChatStore.getState();
      if (socket.auth) {
        socket.emit('update_activity', {
          userId: socket.auth.userId,
          activity:
            currentTrack &&
            `Playing ${currentTrack.data.title} by ${currentTrack.data.artist.name}`,
        });
      }
      set({
        isPlaying: true,
        currentTrack,
      });

      return;
    }

    const list = shuffle ? shuffledQueue : queue;
    let nextIdx = currentIndex + 1;

    if (nextIdx < list.length) {
      const nextSong = list[nextIdx];

      set({
        isPlaying: true,
        currentIndex: nextIdx,
        currentTrack: nextSong,
      });
      const { socket } = useChatStore.getState();

      if (socket.auth) {
        socket.emit('update_activity', {
          userId: socket.auth.userId,
          activity: `Playing ${nextSong.data.title} by ${nextSong.data.artist.name}`,
        });
      }
    } else if (repeatMode === 'all') {
      if (shuffle) {
        const reshuffled = [...queue];

        for (let i = reshuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [reshuffled[i], reshuffled[j]] = [reshuffled[j], reshuffled[i]];
        }

        const { socket } = useChatStore.getState();

        if (socket.auth) {
          socket.emit('update_activity', {
            userId: socket.auth.userId,
            activity: `Playing ${reshuffled[0]} by ${reshuffled[0].data.artist.name}`,
          });
        }

        set({
          shuffledQueue: reshuffled,
          currentIndex: 0,
          currentTrack: reshuffled[0],
          isPlaying: true,
        });
      } else {
        const socket = useChatStore.getState().socket;

        if (socket.auth) {
          socket.emit('update_activity', {
            userId: socket.auth.userId,
            activity: `Playing ${queue[0]} by ${queue[0].data.artist.name}`,
          });
        }
        set({
          currentIndex: 0,
          currentTrack: queue[0],
          isPlaying: true,
        });
      }
    } else {
      set({ isPlaying: false });

      const socket = useChatStore.getState().socket;

      if (socket.auth) {
        socket.emit('update_activity', {
          userId: socket.auth.userId,
          activity: 'Idle',
        });
      }
    }
  }, 100),
  playPrevious: () => {
    const {
      currentIndex,
      queue,
      repeatMode,
      currentTrack,
      shuffle,
      shuffledQueue,
    } = get();

    set({ toastShown: false });

    const list = shuffle ? shuffledQueue : queue;

    if (repeatMode === 'one') {
      const previousIdx = currentIndex - 1;
      set({
        currentTrack: queue[previousIdx],
        isPlaying: true,
        currentIndex: previousIdx,
      });

      const { socket } = useChatStore.getState();

      if (socket.auth) {
        socket.emit('update_activity', {
          userId: socket.auth.userId,
          activity:
            currentTrack &&
            `Playing ${currentTrack.data.title} by ${currentTrack.data.artist.name}`,
        });
      }
      return;
    }
    const previousIdx = currentIndex - 1;

    if (previousIdx >= 0) {
      const prevSong = list[previousIdx];

      set({
        currentIndex: previousIdx,
        currentTrack: prevSong,
        isPlaying: true,
      });

      const socket = useChatStore.getState().socket;

      if (socket.auth) {
        socket.emit('update_activity', {
          userId: socket.auth.userId,
          activity: `Playing ${prevSong.data.title} by ${prevSong.data.artist.name}`,
        });
      }
    } else if (repeatMode === 'all') {
      const idx = list.length - 1;
      set({
        isPlaying: true,
        currentIndex: idx,
        currentTrack: list[idx],
      });

      const { socket } = useChatStore.getState();

      if (socket.auth) {
        socket.emit('update_activity', {
          userId: socket.auth.userId,
          activity:
            currentTrack &&
            `Playing ${currentTrack.data.title} by ${currentTrack.data.artist.name}`,
        });
      }
    } else {
      set({ isPlaying: false });

      const { socket } = useChatStore.getState();

      if (socket.auth) {
        socket.emit('update_activity', {
          userId: socket.auth.userId,
          activity: 'Idle',
        });
      }
    }
  },
}));
