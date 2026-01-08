import { APIS } from '../lib/api';

const fetchInfo = async () => {
  const { data } = await APIS.MUSIC.get('/infos/');

  return data;
};

export const INFO_SERVICE = {
  FETCH_INFO: fetchInfo,
};
