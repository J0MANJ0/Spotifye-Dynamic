import { APIS } from '../lib/api';

const fetchLyrics = async (artist: string, title: string) => {
  const {
    data: { lyrics },
  } = await APIS.LYRICS.get(
    `/${artist.toLocaleLowerCase()}/${title.toLocaleLowerCase()}`
  );

  return lyrics;
};

const searchLyricsLRC = async (params: object) => {
  const { data } = await APIS.LRC_LIB.get('/search', { params });

  return data;
};

export const LYRICS_SERVICE = {
  FETCH_LYRICS: fetchLyrics,
  SEARCH_LYRICS_LRC: searchLyricsLRC,
};
