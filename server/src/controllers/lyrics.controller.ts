import { Request, Response } from 'express';
import { handleResponse } from 'lib/response';
import { asyncHandler } from 'lib/wrapper';
import { LYRICS_REPO } from 'repos/lyrics.repo';
import { LYRICS_SERVICE } from 'services/lyrics.service';
import { MUSIC_SERVICE } from 'services/music.service';

const getLyrics = asyncHandler(async (req: Request, res: Response) => {
  const {
    params: { trackId },
    query: { artist, title },
  } = req;

  const cache = await LYRICS_REPO.GET_LYRICS_REPO(Number(trackId));

  if (cache)
    return handleResponse(res, true, '', {
      source: 'cache',
      lyrics: cache.lyrics,
    });

  const data = await LYRICS_SERVICE.FETCH_LYRICS(String(artist), String(title));

  if (!data) return handleResponse(res, false, 'No Lyrics found!', {}, 404);

  const songDetails = await MUSIC_SERVICE.SEARCH_MUSIC({ ...req.query });

  await LYRICS_REPO.SAVE_LYRICS_REPO(Number(trackId), songDetails?.[0], data);

  return handleResponse(res, true, '', { source: 'api', lyrics: data });
});

const getAllLyrics = asyncHandler(async (req: Request, res: Response) => {
  const data = await LYRICS_REPO.GET_ALL_LYRICS();

  return handleResponse(res, true, '', {
    total: data.length,
    lyrics_list: data,
  });
});

const searchLyrics = asyncHandler(async (req: Request, res: Response) => {
  const {
    query: { artist, title },
  } = req;

  const data = await LYRICS_SERVICE.FETCH_LYRICS(String(artist), String(title));

  if (!data) return handleResponse(res, false, 'No Lyrics found!', {}, 404);

  return handleResponse(res, true, '', { lyrics: data });
});

const searchLyricsLRC = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req;

  const data = await LYRICS_SERVICE.SEARCH_LYRICS_LRC({ ...query });

  if (!data) return handleResponse(res, false, 'No lrc lyrics found!', {}, 404);

  return handleResponse(res, true, '', { results: data.length, data });
});

export const LYRICS_CONTROLLER = {
  GET_LYRICS: getLyrics,
  GET_ALL_LYRICS: getAllLyrics,
  SEARCH_LYRICS: searchLyrics,
  SEARCH_LRC_LYRICS: searchLyricsLRC,
};
