import { APIS } from '../lib/api';

const searchMusic = async (params: object) => {
  const {
    data: { data: response },
  } = await APIS.MUSIC.get('/search', { params });

  return response;
};

export const MUSIC_SERVICE = {
  SEARCH_MUSIC: searchMusic,
};
