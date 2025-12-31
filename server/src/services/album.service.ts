import { APIS } from 'lib/api';

const fetchAlbum = async (id: number) => {
  const { data } = await APIS.MUSIC.get(`/album/${id}`);

  return data;
};

export const ALBUM_SERVICE = {
  FETCH_ALBUM: fetchAlbum,
};
