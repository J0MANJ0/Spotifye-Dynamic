import { ARTISTCACHE } from 'models/artist.model';

const getArtist = async (artistId: number) => {
  return await ARTISTCACHE.findOne({ artistId }).lean();
};

const getArtists = async () => {
  return await ARTISTCACHE.find().lean();
};

const saveArtist = async (artistId: number, data: any) => {
  const artist = await ARTISTCACHE.findOne({ artistId });

  if (!artist) return ARTISTCACHE.create({ artistId, data });
};

export const ARTIST_REPO = {
  GET_ARTIST: getArtist,
  GET_ARTISTS: getArtists,
  SAVE_ARTIST: saveArtist,
};
