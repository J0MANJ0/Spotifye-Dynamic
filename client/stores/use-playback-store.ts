import { create } from 'zustand';

type RepeatMode = 'off' | 'all' | 'one';

interface SyncPlaybackProps {
  currentTrackIdId: string | null;
  currentAlbumIdId: string | null;
  currentIndex: number;
  queueIds: string[];
  shuffledQueueIds: string[];
  repeatMode: RepeatMode;
  likedAlbumPlaying: boolean;
  artistAlbumPlaying: boolean;
  madeForYouAlbumPlaying: boolean;
  shuffle: boolean;
}

interface PlaybackActions {
  setFromPlayer: (state: Partial<SyncPlaybackProps>) => void;
}

export const usePlaybackStore = create<SyncPlaybackProps & PlaybackActions>(
  (set, get) => ({
    currentAlbumIdId: null,
    currentTrackIdId: null,
    currentIndex: -1,
    queueIds: [],
    shuffledQueueIds: [],
    repeatMode: 'off',
    likedAlbumPlaying: false,
    artistAlbumPlaying: false,
    madeForYouAlbumPlaying: false,
    shuffle: false,

    setFromPlayer: (state) => {
      set(state);
    },
  })
);
