import { Request, Response } from 'express';
import { handleResponse } from '../lib/response';
import { asyncHandler } from '../lib/wrapper';
import { TRACKCACHE } from '../models/track.model';
import { LIKEDSONG_REPO } from '../repos/liked-song.repo';

const getLikedSongs = asyncHandler(async (req: Request, res: Response) => {
  const {
    auth: { userId },
  } = req;

  const likedSongs = await LIKEDSONG_REPO.GET_LIKEDSONGS(String(userId));

  return handleResponse(res, true, '', {
    likedSongs: likedSongs?.tracks.reverse(),
  });
});

const like = asyncHandler(async (req: Request, res: Response) => {
  const {
    auth: { userId },
    params: { trackId },
  } = req;

  const track = await TRACKCACHE.findOne({ trackId: Number(trackId) });

  const likedSong = await LIKEDSONG_REPO.LIKE(String(userId), Number(trackId));

  return handleResponse(res, true, 'Song added to Liked Songs', {
    track,
    likedSong,
  });
});

const unlike = asyncHandler(async (req: Request, res: Response) => {
  const {
    auth: { userId },
    params: { trackId },
  } = req;

  const track = await TRACKCACHE.findOne({ trackId: Number(trackId) });

  const unlikedSong = await LIKEDSONG_REPO.UNLIKE(
    String(userId),
    Number(trackId)
  );

  return handleResponse(res, true, 'Song removed from Liked Songs', {
    track,
    unlikedSong,
  });
});

export const LIKEDSONG_CONTROLLER = {
  GET_LIKEDSONGS: getLikedSongs,
  LIKE: like,
  UNLIKE: unlike,
};
