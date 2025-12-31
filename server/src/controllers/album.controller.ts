import { Request, Response } from 'express';
import { handleResponse } from 'lib/response';
import { asyncHandler } from 'lib/wrapper';
import { ALBUM_REPO } from 'repos/album.repo';
import { ALBUM_SERVICE } from 'services/album.service';

const getAlbum = asyncHandler(async (req: Request, res: Response) => {
  const {
    params: { albumId },
  } = req;

  const data = await ALBUM_SERVICE.FETCH_ALBUM(Number(albumId));

  if (!data) return handleResponse(res, false, 'No Album found!', {}, 404);

  await ALBUM_REPO.SAVE_ALBUM(Number(albumId), data);

  const cache = await ALBUM_REPO.GET_ALBUM(Number(albumId));

  return handleResponse(res, true, '', { album: cache });
});

const getAlbums = asyncHandler(async (req: Request, res: Response) => {
  const albums = await ALBUM_REPO.GET_ALBUMS();

  return handleResponse(res, true, '', { total: albums.length, albums });
});

export const ALBUM_CONTROLLER = {
  GET_ALBUM: getAlbum,
  GET_ALBUMS: getAlbums,
};
