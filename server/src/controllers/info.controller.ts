import { Request, Response } from 'express';
import { handleResponse } from '../lib/response';
import { asyncHandler } from '../lib/wrapper';
import { INFO_SERVICE } from '../services/info.service';

const getInfo = asyncHandler(async (_req: Request, res: Response) => {
  const info = await INFO_SERVICE.FETCH_INFO();

  return handleResponse(res, true, '', { info });
});

export const INFO_CONTROLLER = {
  GET_INFO: getInfo,
};
