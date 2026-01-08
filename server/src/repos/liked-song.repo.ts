import { LIKEDSONGCACHE } from '../models/liked-song.model';
import { TRACKCACHE } from '../models/track.model';

const getLikedSongs = async (userId: string) => {
  return await LIKEDSONGCACHE.findOne({ userId })
    .lean()
    .populate({
      path: 'tracks',
      populate: {
        path: 'albumId',
        model: 'albums',
      },
    });
};

const createLikedSongs = async (userId: string) => {
  return await LIKEDSONGCACHE.create({ userId, tracks: [] });
};

const like = async (userId: string, trackId: number) => {
  const track = await TRACKCACHE.findOne({ trackId });

  const likedSong = await LIKEDSONGCACHE.findOneAndUpdate(
    { userId },
    { $addToSet: { tracks: track?._id } },
    { new: true }
  ).populate('tracks');

  return likedSong;
};

const unlike = async (userId: string, trackId: number) => {
  const track = await TRACKCACHE.findOne({ trackId });

  const unlikedSong = await LIKEDSONGCACHE.findOneAndUpdate(
    { userId },
    { $pull: { tracks: track?._id } },
    { new: true }
  );

  return unlikedSong;
};

export const LIKEDSONG_REPO = {
  GET_LIKEDSONGS: getLikedSongs,
  CREATE_LIKEDSONGS: createLikedSongs,
  LIKE: like,
  UNLIKE: unlike,
};
