import { api } from '@/lib/api';
import { parseLyrics } from '@/lib/utils';
import type {
  Album,
  Track,
  Stats,
  ArtistData,
  Lrc,
  Artist,
  TrackData,
} from '@/types';
import toast from 'react-hot-toast';
import { create } from 'zustand';

type LyricLine = {
  time: number;
  text: string;
};

interface IMusicProps {
  tracks: Track[];
  trackChart: TrackData | null;
  albums: Album[];
  artistPage: Artist | null;
  artist: Artist | null;
  artists: Artist[] | null;
  album: Album | null;
  currentAlbum: Album | null;
  albumDialog: Album | null;
  likedSongs: Track[];
  featuredsongs: Track[];
  madeforyou: Track[];
  trendingsongs: Track[];
  stats: Stats;
  url: string | null;
  reverseSongsOrder: boolean;
  lyrics: LyricLine[] | [];
  lrcs: Lrc[] | [];
  lrcLyrics: LyricLine[] | [];
  error: string | null;
  loadingStats: boolean;
  loadingAlbum: boolean;
  loadingAlbums: boolean;
  loadingTrack: boolean;
  loadingChartTrack: boolean;
  loadingArtist: boolean;
  loadingArtistPage: boolean;
  loadingArtists: boolean;
  loadingMadeForYou: boolean;
  loadingLyrics: boolean;
  loadingLrc: boolean;
  loadingLikedSongs: boolean;
  reverseOrder: boolean;
  searchKeys: string[];
  selectedstate: string;
  sortKey: 'title' | 'artist' | 'createdAt';

  fetchStats: () => Promise<void>;
  fetchLrcs: () => Promise<void>;
  fetchLrc: (trackId: number) => Promise<void>;
  createLrc: (formData: object) => Promise<void>;
  fetchLyrics: (trackId: number) => Promise<void>;
  fetchAlbums: () => Promise<void>;
  fetchArtistPage: (artistId: number) => Promise<void>;
  fetchArtist: (artistId: number) => Promise<void>;
  fetchArtists: () => Promise<void>;
  fetchAlbum: (albumId: number) => Promise<void>;
  fetchAlbumDialog: (albumId: number) => Promise<void>;
  fetchLikedSongs: () => Promise<void>;
  fetchMadeForYou: () => Promise<void>;
  fetchTracks: () => Promise<void>;
  fetchChartTrack: (trackId: number) => Promise<void>;
  like: (trackId: number) => Promise<void>;
  unLike: (trackId: number) => Promise<void>;
  setState: (state: string) => void;
  setSortKey: (key: 'title' | 'artist' | 'createdAt') => void;
  toggleReverse: () => void;
  deleteAlbum: (albumId: string) => Promise<void>;
  deleteTrack: (trackId: string) => Promise<void>;
  createAlbum: (albumId: number) => Promise<void>;
  createTrack: (formData: object) => Promise<void>;
}

export const useMusicStore = create<IMusicProps>((set) => ({
  tracks: [],
  albums: [],
  currentAlbum: null,
  trackChart: null,
  album: null,
  albumDialog: null,
  artistPage: null,
  artist: null,
  artists: [],
  likedSongs: [],
  featuredsongs: [],
  madeforyou: [],
  trendingsongs: [],
  lyrics: [],
  lrcs: [],
  lrcLyrics: [],
  error: null,
  url: null,
  reverseSongsOrder: false,
  sortKey: 'title',
  loadingStats: false,
  loadingAlbum: false,
  loadingAlbums: false,
  loadingTrack: false,
  loadingChartTrack: false,
  loadingLyrics: false,
  loadingMadeForYou: false,
  loadingArtist: false,
  loadingArtistPage: false,
  loadingArtists: false,
  loadingLrc: false,
  loadingLikedSongs: false,
  stats: {
    albums: 0,
    tracks: 0,
    artists: 0,
    users: 0,
    lyrics: 0,
  },
  searchKeys: ['title', 'artist'],
  selectedstate: 'queue',
  reverseOrder: false,

  setState: (state) => set({ selectedstate: state }),
  setSortKey: (key: 'title' | 'artist' | 'createdAt') => set({ sortKey: key }),
  toggleReverse: () => {
    set((state) => ({ reverseSongsOrder: !state.reverseSongsOrder }));
  },
  fetchLrc: async (trackId) => {
    set({ loadingLrc: true });
    try {
      const {
        data: { success, url },
      } = await api.get(`/lrc/${trackId}`);

      if (success && url) {
        const lrcContent = await fetch(url).then((r) => r.text());

        const parsedLyrics = parseLyrics(lrcContent);

        set({ url, lrcLyrics: parsedLyrics });
      } else {
        set({ lrcLyrics: [], url: null });
      }
    } catch (error: any) {
      set({ error: error?.response?.data?.message, lrcLyrics: [] });
    } finally {
      set({ loadingLrc: false });
    }
  },
  fetchLrcs: async () => {
    set({ loadingLrc: true });
    try {
      const {
        data: { success, lrcs },
      } = await api.get('/admin/lrc/all');

      success ? set({ lrcs }) : set({ lrcs: [] });
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set({ loadingLrc: false });
    }
  },
  fetchMadeForYou: async () => {
    set({ loadingMadeForYou: true });
    try {
      const {
        data: { success, tracks },
      } = await api.get('/tracks/user/madeforyou');

      success ? set({ madeforyou: tracks }) : set({ madeforyou: [] });
    } catch (error: any) {
      set({ error: error?.response?.data?.message, madeforyou: [] });
    } finally {
      set({ loadingMadeForYou: false });
    }
  },
  createLrc: async (formData) => {
    set({ loadingLrc: true });
    try {
      const {
        data: { success, message },
      } = await api.post('/admin/lrc/create', formData);

      success ? toast.success(message) : toast.error(message);
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
      toast.error(error?.response?.data?.message);
    } finally {
      set({ loadingLrc: false });
    }
  },
  fetchStats: async () => {
    set({ loadingStats: true });
    try {
      const {
        data: { success, tracks, albums, artists, users, lyrics },
      } = await api.get('/stats');

      if (success) {
        set({ stats: { tracks, albums, artists, users, lyrics } });
      }
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
      toast.error(error?.response?.data?.message);
    } finally {
      set({ loadingStats: false });
    }
  },
  fetchAlbums: async () => {
    set({ loadingAlbums: true });
    try {
      const {
        data: { success, albums },
      } = await api.get('/albums');

      success ? set({ albums }) : set({ albums: [] });
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set({ loadingAlbums: false });
    }
  },
  fetchChartTrack: async (trackId) => {
    set({ loadingChartTrack: true });
    try {
      const {
        data: { success, track_chart: trackChart },
      } = await api.get(`/tracks/chart/${trackId}`);

      success ? set({ trackChart }) : set({ trackChart: null });
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set({ loadingChartTrack: false });
    }
  },
  fetchArtistPage: async (artistId) => {
    set({ loadingArtistPage: true });
    try {
      const {
        data: { success, artist },
      } = await api.get(`/artists/${artistId}`);

      success ? set({ artistPage: artist }) : set({ artistPage: null });
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set({ loadingArtistPage: false });
    }
  },
  fetchArtist: async (artistId) => {
    set({ loadingArtist: true });

    try {
      const {
        data: { success, artist },
      } = await api.get(`/artists/${artistId}`);

      success ? set({ artist }) : set({ artist: null });
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set({ loadingArtist: false });
    }
  },
  fetchArtists: async () => {
    set({ loadingArtists: true });
    try {
      const {
        data: { success, artists },
      } = await api.get('/artists');

      success ? set({ artists }) : set({ artists: [] });
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set({ loadingArtists: false });
    }
  },
  fetchAlbum: async (albumId) => {
    set({ loadingAlbum: true });
    try {
      const {
        data: { success, album },
      } = await api.get(`/albums/${albumId}`);

      success ? set({ album }) : set({ album: null });
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set({ loadingAlbum: false });
    }
  },
  fetchAlbumDialog: async (albumId) => {
    try {
      const {
        data: { success, album },
      } = await api.get(`/albums/${albumId}`);

      success ? set({ albumDialog: album }) : set({ albumDialog: null });
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    }
  },
  like: async (trackId) => {
    try {
      const {
        data: { success, message, track },
      } = await api.patch(`/liked-songs/like/${trackId}`);

      if (success) {
        set((state) => ({
          likedSongs: [...state.likedSongs, track],
        }));
        toast.success(message, { position: 'bottom-center' });
      } else {
        toast.error(message, { position: 'bottom-center' });
      }
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
      toast.error(error?.response?.data?.message);
    }
  },
  unLike: async (trackId) => {
    try {
      const {
        data: { success, message, track },
      } = await api.patch(`/liked-songs/unlike/${trackId}`);

      if (success) {
        set((state) => ({
          likedSongs: state.likedSongs.filter((t) => t._id !== track?._id),
        }));
        toast.success(message, { position: 'bottom-center' });
      } else {
        toast.error(message, { position: 'bottom-center' });
      }
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
      toast.error(error?.response?.data?.message);
    }
  },
  fetchTracks: async () => {
    set({ loadingTrack: true });
    try {
      const {
        data: { success, tracks },
      } = await api.get('/tracks');

      success ? set({ tracks }) : set({ tracks: [] });
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set({ loadingTrack: false });
    }
  },
  fetchLikedSongs: async () => {
    set({ loadingLikedSongs: true });
    try {
      const {
        data: { success, likedSongs },
      } = await api.get('/liked-songs');

      success ? set({ likedSongs }) : set({ likedSongs: [] });
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set({ loadingLikedSongs: false });
    }
  },
  fetchLyrics: async (trackId) => {
    set({ loadingLyrics: true });
    try {
      const {
        data: { success, message, lyrics },
      } = await api.get(`/lyrics/${trackId}`);

      if (success) {
        const parsed = parseLyrics(lyrics);
        set({ lyrics: parsed });
      } else {
        set({ error: message });
      }
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set({ loadingLyrics: false });
    }
  },
  createAlbum: async (albumId) => {
    set({ loadingAlbum: true });
    try {
      const {
        data: { success, message },
      } = await api.post('/admin/album', { albumId });

      success ? toast.success(message) : toast.error(message);
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set({ loadingAlbum: false });
    }
  },
  createTrack: async (formData) => {
    set({ loadingTrack: true });
    try {
      const {
        data: { success, message },
      } = await api.post('/admin/track', formData);

      success ? toast.success(message) : toast.error(message);
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
      toast.error(error?.response?.data?.message || error);
    } finally {
      set({ loadingTrack: false });
    }
  },
  deleteAlbum: async (albumId) => {
    set({ loadingAlbum: true });
    try {
      const {
        data: { success, message },
      } = await api.delete(`/admin/album/${albumId}`);

      success ? toast.success(message) : toast.error(message);
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set({ loadingAlbum: false });
    }
  },
  deleteTrack: async (trackId) => {
    set({ loadingTrack: true });
    try {
      const {
        data: { success, message },
      } = await api.delete(`/admin/track/${trackId}`);

      success ? toast.success(message) : toast.error(message);
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
      toast.error(error?.response?.data?.message);
    } finally {
      set({ loadingTrack: false });
    }
  },
}));
