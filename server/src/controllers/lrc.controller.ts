import { Request, Response } from 'express';
import { handleResponse } from '../lib/response';
import { UPLOAD } from '../lib/upload';
import { asyncHandler } from '../lib/wrapper';
import { LRC_REPO } from '../repos/lrc.repo';

const getLrcfile = asyncHandler(async (req: Request, res: Response) => {
  const {
    params: { trackId },
  } = req;

  const data = await LRC_REPO.GET_LRC(Number(trackId));

  if (!data)
    return handleResponse(res, false, 'No Lyrics found!', { url: null }, 404);

  return handleResponse(res, true, '', { url: data.lyrics?.url });
});

const getLrcFiles = asyncHandler(async (_req: Request, res: Response) => {
  const data = await LRC_REPO.GET_LRC_FILES();

  if (!data.length) return handleResponse(res, false, '', { lrcs: [] });

  return handleResponse(res, true, '', { lrcs: data });
});

const saveLrc = asyncHandler(async (req: Request, res: Response) => {
  const {
    body: { lyrics, trackId },
  } = req;

  const uploadUrl = await UPLOAD.UPLOAD_LRC(String(lyrics), `track_${trackId}`);

  await LRC_REPO.SAVE_LRC(Number(trackId), String(uploadUrl.url));

  return handleResponse(res, true, 'Lyrics uploaded successfully', {}, 201);
});

export const LRC_CONTROLLER = {
  GET_LRC: getLrcfile,
  GET_LRC_FILES: getLrcFiles,
  SAVE_LRC: saveLrc,
};
