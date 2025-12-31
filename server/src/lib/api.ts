import axios from 'axios';
import { ENV } from './env';

const musicAPI = axios.create({
  baseURL: ENV.DEEZER_BASE,
});

const lyricsAPI = axios.create({
  baseURL: ENV.LYRICS_BASE,
  headers: {
    'Content-Type': 'text/plain',
  },
});

const lrcAPI = axios.create({
  baseURL: ENV.LRC_LIB,
});

export const APIS = {
  MUSIC: musicAPI,
  LYRICS: lyricsAPI,
  LRC_LIB: lrcAPI,
};
