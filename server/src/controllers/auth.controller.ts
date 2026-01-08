import { Request, Response } from 'express';
import { handleResponse } from '../lib/response';
import { asyncHandler } from '../lib/wrapper';
import { LIKEDSONG_REPO } from '../repos/liked-song.repo';
import { USER_REPO } from '../repos/user.repo';

const callBack = asyncHandler(async (req: Request, res: Response) => {
  const {
    body: { clerkId, firstName, lastName, imageUrl },
  } = req;

  if (!clerkId || !firstName || !lastName || !imageUrl)
    return handleResponse(res, false, 'Missing details(s)');

  const user = await USER_REPO.GET_USER(String(clerkId));

  if (!user) {
    await USER_REPO.CREATE_USER(
      String(clerkId),
      `${firstName || ''} ${lastName || ''}`.trim(),
      String(imageUrl)
    );
    await LIKEDSONG_REPO.CREATE_LIKEDSONGS(String(clerkId));
  }

  return handleResponse(res, true, '', { sucess: true });
});

export const AUTH_CALLBACK = {
  CALLBACK: callBack,
};
