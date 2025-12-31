import { api } from '@/lib/api';
import {
  AlbumData,
  ArtistData,
  PlaylistData,
  PodcastData,
  TrackData,
} from '@/types';
import { create } from 'zustand';

interface IChartProps {
  tracks: TrackData[];
  artists: ArtistData[];
  albums: AlbumData[];
  playlists: PlaylistData[];
  podcasts: PodcastData[];
  error: string | null;
  loading: boolean;

  fetchChart: () => Promise<void>;
}

export const useChartStore = create<IChartProps>((set) => ({
  tracks: [],
  albums: [],
  artists: [],
  playlists: [],
  podcasts: [],
  error: null,
  loading: false,

  fetchChart: async () => {
    set({ loading: true });
    try {
      const {
        data: {
          success,
          chart: {
            albums: { data: albums },
            artists: { data: artists },
            playlists: { data: playlists },
            podcasts: { data: podcasts },
            tracks: { data: tracks },
          },
        },
      } = await api.get('/chart');

      success
        ? set({ tracks, albums, artists, playlists, podcasts })
        : set({
            tracks: [],
            albums: [],
            artists: [],
            playlists: [],
            podcasts: [],
          });
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    } finally {
      set({ loading: false });
    }
  },
}));
