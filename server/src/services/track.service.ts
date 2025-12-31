import { APIS } from 'lib/api';

const fetchTrack = async (id: number) => {
  const { data } = await APIS.MUSIC.get(`/track/${id}`);

  return data;
};

export const TRACK_SERVICE = {
  FETCH_TRACK: fetchTrack,
};
