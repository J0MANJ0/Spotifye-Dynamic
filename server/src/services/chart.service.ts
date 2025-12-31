import { APIS } from 'lib/api';

const fetchChart = async () => {
  const { data } = await APIS.MUSIC.get('/chart');

  return data;
};

export const CHART_SERVICE = {
  FETCH_CHART: fetchChart,
};
