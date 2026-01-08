import { Response, Request } from 'express';
import { handleResponse } from '../lib/response';
import { asyncHandler } from '../lib/wrapper';
import { MUSIC_SERVICE } from '../services/music.service';

const searchMusic = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req;

  const data = await MUSIC_SERVICE.SEARCH_MUSIC({ ...query });

  if (!data.length)
    return handleResponse(res, false, 'No music found!', {}, 404);

  return handleResponse(res, true, '', {
    results: data.length,
    searchList: data,
  });
});

export const MUSIC_CONTROLLER = {
  SEARCH_MUSIC: searchMusic,
};
