import { APIS } from 'lib/api';

const fetchArtist = async (id: number) => {
  const { data } = await APIS.MUSIC.get(`/artist/${id}`);

  return data;
};

export const ARTIST_SERVICE = {
  FETCH_ARTIST: fetchArtist,
};
