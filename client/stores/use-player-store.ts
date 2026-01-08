import { create } from 'zustand';
import { useAuthStore } from './use-auth-store';
import { debounce } from 'lodash';
import { useSocketStore } from './use-socket-store';
import { useMusicStore } from './use-music-store';
import { Device } from '@/types';

type RepeatMode = 'off' | 'all' | 'one';

type AlbumType =
  | 'likedSongsAlbum'
  | 'artistAlbum'
  | 'madeForYouAlbum'
  | 'album';

interface PlaybackState {
  isPlaying: boolean;
  likedAlbumPlaying: boolean;
  artistAlbumPlaying: boolean;
  madeForYouAlbumPlaying: boolean;
  repeatMode: RepeatMode;
  volume: number;
  prevVolume: number;
  shuffle: boolean;
  queue: string[];
  shuffledQueue: string[];
  currentIndex: number;
  currentTrackId: string | null;
  currentTime: number;
  currentAlbumId: string | null;
  syncAt: number;
  explicitContent: boolean;
  syncReason: 'seek' | 'track-change' | 'join' | null;
}

interface Props {
  currentTrackId: string | null;
  isPlaying: boolean;
  shuffle: boolean;
  shuffledQueue: string[];
  queue: string[];
  likedAlbumPlaying: boolean;
  artistAlbumPlaying: boolean;
  madeForYouAlbumPlaying: boolean;
  currentIndex: number;
  currentTime: number;
  repeatMode: RepeatMode;
  volume: number;
  prevVolume: number;
  progress: number;
  toastShown: boolean;
  audioRef: HTMLAudioElement | null;
  minSize: number;
  isMaxRight: boolean;
  isMaxLeft: boolean;
  isActive: boolean;
  lastSyncAt: number;
  devices: Device[];

  setAudioRef: (ref: HTMLAudioElement) => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;

  setToastShown: (value: boolean) => void;
  setProgress: (progress: number) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  setCurrentTime: (currentTime: number) => void;
  toggleRepeatMode: () => void;
  toggleShuffle: () => void;
  playAlbum: (
    songs: string[],
    TYPE: AlbumType,
    albumId?: string | null,
    startIndex?: number
  ) => void;

  setcurrentTrackId: (track: string | null) => void;
  toggleSong: () => void;
  requestSeek: (time: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  setActiveDevice: (socketId: string) => void;

  syncPlayback: (state: PlaybackState) => void;
}

export const usePlayerStore = create<Props>((set, get) => ({
  currentTrackId: null,
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
  volume: 50,
  prevVolume: 50,
  progress: 0,
  isMaxRight: true,
  isMaxLeft: true,
  audioRef: null,
  toastShown: false,
  lastSyncAt: 0,
  isActive: false,
  devices: [],

  setAudioRef: (ref) => {
    const { isActive } = get();

    ref.muted = !isActive;

    set({ audioRef: ref });
  },
  seekTo: (time) => {
    const { audioRef: audio } = get();

    if (!audio) return;

    audio.currentTime = time;
  },
  setToastShown: (toastShown) => set({ toastShown }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setProgress: (progress) => {
    set({ progress });
  },
  setRepeatMode: (value) => {
    set({ repeatMode: value });
  },
  toggleRepeatMode: () => {
    const { repeatMode } = get();
    const { socket, emit } = useSocketStore.getState();

    if (!socket) return;

    const nextMode =
      repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off';

    emit('playback:command', { type: 'SET_REPEAT', mode: nextMode });
  },
  toggleShuffle: () => {
    // const { shuffle, queue, currentTrackId } = get();
    // const { user } = useAuthStore.getState();

    // if (!user) return;

    // if (!shuffle) {
    //   const shuffled = [...queue];

    //   // fisher-yates shuffle method

    //   for (let i = shuffled.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));

    //     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    //   }

    //   if (currentTrackId) {
    //     const idx = shuffled.findIndex((s) => s === currentTrackId);

    //     if (idx > -1) {
    //       [shuffled[0], shuffled[idx]] = [shuffled[idx], shuffled[0]];
    //     }
    //   }

    //   setQueueAndSync(shuffled, 0);

    //   set({
    //     shuffle: true,
    //     shuffledQueue: shuffled,
    //     currentIndex: 0,
    //     currentTrackId: shuffled[0],
    //   });
    // } else {
    //   const currentIndex = currentTrackId
    //     ? queue.findIndex((s) => s === currentTrackId)
    //     : 0;

    //   setQueueAndSync([], currentIndex);

    //   set({
    //     shuffle: false,
    //     shuffledQueue: [],
    //     currentIndex,
    //   });
    // }

    const { socket, emit } = useSocketStore.getState();

    if (!socket) return;

    emit('playback:command', { type: 'TOGGLE_SHUFFLE' });
  },
  playAlbum: (queue, TYPE, albumId, startIndex = 0) => {
    const { socket, emit } = useSocketStore.getState();
    const { tracksByIds } = useMusicStore.getState();

    const { user } = useAuthStore.getState();
    if (!queue.length || !socket || !user) return;

    const {
      data: {
        title,
        artist: { name: artist },
      },
    } = tracksByIds[queue[startIndex]];

    emit('playback:command', {
      type: 'PLAY_ALBUM',
      queue,
      startIndex,
      TYPE,
      albumId,
    });

    emit('update:user:activity', {
      userId: user.clerkId,
      activity: !get().isPlaying ? `Playing ${title} by ${artist}` : 'Idle',
    });
  },
  setcurrentTrackId: (trackId) => {
    if (!trackId) return;
    const { socket, emit } = useSocketStore.getState();

    const { tracksByIds } = useMusicStore.getState();
    const { user } = useAuthStore.getState();

    const {
      data: {
        title,
        artist: { name: artist },
      },
    } = tracksByIds[get().currentTrackId!];

    if (!socket || !user) return;

    emit('playback:command', { type: 'SET_TRACK', trackId });

    emit('update:user:activity', {
      userId: user.clerkId,
      activity: !get().isPlaying ? `Playing ${title} by ${artist}` : 'Idle',
    });
  },
  requestSeek: debounce((time: number) => {
    const { socket, emit } = useSocketStore.getState();

    if (!socket) return;

    emit('playback:command', { type: 'SEEK', time });
  }, 700),
  toggleSong: () => {
    const { currentTrackId } = get();
    const { socket, emit } = useSocketStore.getState();
    const { tracksByIds } = useMusicStore.getState();
    const { user } = useAuthStore.getState();

    const {
      data: {
        title,
        artist: { name: artist },
      },
    } = tracksByIds[currentTrackId!];

    if (!socket || !user) return;

    emit('playback:command', {
      type: 'TOGGLE_PLAY',
    });

    emit('update:user:activity', {
      userId: user.clerkId,
      activity: !get().isPlaying ? `Playing ${title} by ${artist}` : 'Idle',
    });
  },
  playNext: debounce(() => {
    const { socket, emit } = useSocketStore.getState();

    const { tracksByIds } = useMusicStore.getState();

    const {
      currentTrackId,
      repeatMode,
      currentIndex,
      shuffle,
      shuffledQueue,
      queue,
    } = get();

    const currentTrack = tracksByIds[currentTrackId!];
    const { user } = useAuthStore.getState();

    if (!socket || !user) return;

    const nextIdx = currentIndex + 1;
    const list = shuffle ? shuffledQueue : queue;

    emit('playback:command', { type: 'NEXT' });

    if (repeatMode === 'one' && currentTrackId) {
      emit('update:user:activity', {
        userId: user.clerkId,
        activity:
          currentTrack &&
          `Playing ${currentTrack?.data?.title} by ${currentTrack?.data?.artist?.name}`,
      });
    }

    if (nextIdx) {
      const nextTrack = tracksByIds[list[nextIdx]];

      emit('update:user:activity', {
        userId: user.clerkId,
        activity: `Playing ${nextTrack?.data?.title} by ${nextTrack?.data?.artist?.name}`,
      });
    } else if (repeatMode === 'all') {
      if (shuffle) {
        const reshuffled = [...queue];

        for (let i = reshuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [reshuffled[i], reshuffled[j]] = [reshuffled[j], reshuffled[i]];
        }

        emit('update:user:activity', {
          userId: user.clerkId,
          activity: `Playing ${tracksByIds[reshuffled[0]]?.data?.title} by ${
            tracksByIds[reshuffled[0]]?.data?.artist?.name
          }`,
        });
      } else {
        emit('update:user:activity', {
          userId: user.clerkId,
          activity: `Playing ${tracksByIds[queue[0]]?.data?.title} by ${
            tracksByIds[queue[0]]?.data?.artist?.name
          }`,
        });
      }
    } else {
      emit('update:user:activity', {
        userId: user.clerkId,
        activity: 'Idle',
      });
    }
  }, 100),
  playPrevious: () => {
    const { socket, emit } = useSocketStore.getState();
    const {
      currentTrackId,
      repeatMode,
      currentIndex,
      shuffle,
      shuffledQueue,
      queue,
    } = get();

    const { tracksByIds } = useMusicStore.getState();

    const currentTrack = tracksByIds[get().currentTrackId!];
    const { user } = useAuthStore.getState();

    if (!socket || !user) return;

    const prevIdx = currentIndex - 1;
    const list = shuffle ? shuffledQueue : queue;

    emit('playback:command', { type: 'PREV' });

    if (repeatMode === 'one') {
      emit('update:user:activity', {
        userId: user.clerkId,
        activity: `Playing ${tracksByIds[queue[prevIdx]]?.data?.title} by ${
          tracksByIds[queue[prevIdx]]?.data?.artist?.name
        }`,
      });
    }

    if (prevIdx >= 0) {
      emit('update:user:activity', {
        userId: user.clerkId,
        activity: `Playing ${tracksByIds[list[prevIdx]]?.data?.title} by ${
          tracksByIds[list[prevIdx]]?.data?.artist?.name
        }`,
      });
    } else if (repeatMode === 'all') {
      const idx = list.length - 1;
      emit('update:user:activity', {
        userId: user.clerkId,
        activity: `Playing ${tracksByIds[list[idx]]?.data?.title} by ${
          tracksByIds[list[idx]]?.data?.artist?.name
        }`,
      });
    } else {
      emit('update:user:activity', {
        userId: user.clerkId,
        activity: 'Idle',
      });
    }
  },
  setVolume: (volume) => {
    const { socket, emit } = useSocketStore.getState();

    if (!socket) return;

    emit('playback:command', { type: 'SET_VOLUME', volume });
  },
  setActiveDevice: (socketId) => {
    const { socket, emit } = useSocketStore.getState();

    if (!socket) return;

    emit('set:active:device', { type: 'SET_ACTIVE', socketId });
  },
  toggleMute: () => {
    const { volume, prevVolume } = get();

    const { socket, emit } = useSocketStore.getState();

    if (!socket) return;

    if (volume === 0) {
      emit('playback:command', {
        type: 'SET_VOLUME',
        volume: prevVolume || 50,
      });
    } else {
      emit('playback:command', { type: 'SET_VOLUME', volume: 0 });
    }
  },
  syncPlayback: (state) => {
    const { audioRef: audio } = get();
    let targetTime = state.currentTime;

    // Only apply drift math if it's ongoing playback (not join, seek, or pause)
    if (
      state.isPlaying &&
      state.syncReason !== 'join' &&
      state.syncReason !== 'track-change'
    ) {
      targetTime = state.currentTime + (Date.now() - state.syncAt) / 1000;
    }

    if (audio) {
      const drift = Math.abs(audio.currentTime - targetTime);
      if (drift > 0.4) {
        audio.currentTime = targetTime;
      }

      if (state.isPlaying && audio.paused) audio.play().catch(() => {});
      if (!state.isPlaying && !audio.paused) audio.pause();
    }

    set({
      currentTrackId: state.currentTrackId,
      isPlaying: state.isPlaying,
      likedAlbumPlaying: state.likedAlbumPlaying,
      madeForYouAlbumPlaying: state.madeForYouAlbumPlaying,
      artistAlbumPlaying: state.artistAlbumPlaying,
      queue: state.queue,
      currentIndex: state.currentIndex,
      shuffle: state.shuffle,
      repeatMode: state.repeatMode,
      shuffledQueue: state.shuffledQueue,
      currentTime: targetTime,
      volume: state.volume,
      prevVolume: state.prevVolume,
      lastSyncAt: state.syncAt,
    });

    useMusicStore.setState({ currentAlbumId: state.currentAlbumId });

    useAuthStore.setState({ explicitContent: state.explicitContent });
  },
}));

const computeEffectiveTime = (state: PlaybackState) => {
  if (!state.isPlaying) return state.currentTime;

  return state.currentTime + (Date.now() - state.syncAt) / 1000;
};
