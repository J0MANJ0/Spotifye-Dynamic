import { Request, Response } from 'express';
import { handleResponse } from '../lib/response';
import { asyncHandler } from '../lib/wrapper';
import { ALBUMCACHE } from '../models/album.model';
import { ARTISTCACHE } from '../models/artist.model';
import { LRCCACHE } from '../models/lrc.model';
import { TRACKCACHE } from '../models/track.model';
import { USERCACHE } from '../models/user.model';

const getStats = asyncHandler(async (req: Request, res: Response) => {
  const [tracks, albums, users, artists, lyrics] = await Promise.all([
    TRACKCACHE.countDocuments(),
    ALBUMCACHE.countDocuments(),
    USERCACHE.countDocuments(),
    ARTISTCACHE.countDocuments(),
    LRCCACHE.countDocuments(),
  ]);

  return handleResponse(res, true, '', {
    tracks,
    users,
    albums,
    artists,
    lyrics,
  });
});

export const STATS_CONTROLLER = {
  STATS: getStats,
};
