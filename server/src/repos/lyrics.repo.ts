import { LYRICSCACHE } from '../models/lyrics.model';

const getLyrics = async (songId: number) => {
  return await LYRICSCACHE.findOne({ songId }).lean();
};

const getAllLyrics = async () => {
  return await LYRICSCACHE.find().lean().sort({ createdAt: -1 });
};

const saveLyrics = async (songId: number, data: any, lyrics: string) => {
  const song = await LYRICSCACHE.findOne({ songId });

  if (!song)
    return await LYRICSCACHE.create({
      songId,
      albumId: data?.album?.id,
      artistId: data?.artist?.id,
      lyrics,
    });
  else return null;
};

export const LYRICS_REPO = {
  GET_LYRICS_REPO: getLyrics,
  GET_ALL_LYRICS: getAllLyrics,
  SAVE_LYRICS_REPO: saveLyrics,
};
