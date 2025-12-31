import { Request, Response } from 'express';
import { handleResponse } from 'lib/response';
import { asyncHandler } from 'lib/wrapper';
import { ARTIST_REPO } from 'repos/artist.repo';
import { ARTIST_SERVICE } from 'services/artist.service';

const getArtist = asyncHandler(async (req: Request, res: Response) => {
  const {
    params: { artistId },
  } = req;

  const cache = await ARTIST_REPO.GET_ARTIST(Number(artistId));

  if (cache)
    return handleResponse(res, true, '', {
      source: 'cache',
      artist: cache,
    });

  const data = await ARTIST_SERVICE.FETCH_ARTIST(Number(artistId));

  if (!data) return handleResponse(res, false, 'No Artist found!', {}, 404);

  await ARTIST_REPO.SAVE_ARTIST(Number(artistId), data);

  return handleResponse(res, true, '', { source: 'api', artist: data });
});

const getArtists = asyncHandler(async (req: Request, res: Response) => {
  const artists = await ARTIST_REPO.GET_ARTISTS();

  return handleResponse(res, true, '', { artists });
});

export const ARTIST_CONTROLLER = {
  GET_ARTIST: getArtist,
  GET_ARTISTS: getArtists,
};
