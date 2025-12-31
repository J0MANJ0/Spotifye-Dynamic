import { Request, Response } from 'express';
import { handleResponse } from 'lib/response';
import { asyncHandler } from 'lib/wrapper';
import { ARTISTCACHE } from 'models/artist.model';
import { FOLLOWCACHE } from 'models/follow.model';
import { USERCACHE } from 'models/user.model';
import { Types } from 'mongoose';
import { FOLLOW_REPO } from 'repos/follow.repo';
import { USER_REPO } from 'repos/user.repo';

const followTarget = asyncHandler(async (req: Request, res: Response) => {
  const {
    auth: { userId },
    body: { targetType, target, artistId },
  } = req;

  const user = await USER_REPO.GET_USER(userId as string);

  if (targetType === 'artists') {
    await FOLLOW_REPO.FOLLOW_TARGET(user?._id!, targetType, Number(artistId));

    return handleResponse(res, true, 'Added to Your Library', {}, 201);
  } else {
    await FOLLOW_REPO.FOLLOW_TARGET(
      user?._id!,
      targetType,
      null,
      new Types.ObjectId(target)
    );

    return handleResponse(res, true, 'User Followed', {}, 201);
  }
});

const unfollowTarget = asyncHandler(async (req: Request, res: Response) => {
  const {
    auth: { userId },
    query: { target, targetType, artistId },
  } = req;

  const user = await USER_REPO.GET_USER(userId as string);

  if (targetType === 'artists') {
    await FOLLOW_REPO.UNFOLLOW_TARGET(user?._id!, targetType, Number(artistId));
    return handleResponse(res, true, 'Removed from Your Library', {});
  } else {
    await FOLLOW_REPO.UNFOLLOW_TARGET(
      user?._id!,
      targetType as string,
      null,
      new Types.ObjectId(target as any)
    );

    return handleResponse(res, true, 'User unfollowed', {});
  }
});

const targetStatus = asyncHandler(async (req: Request, res: Response) => {
  const {
    auth: { userId },
    query: { target, targetType, artistId },
  } = req;

  if (isNaN(artistId as any))
    return handleResponse(res, false, 'ArtistId must be a number', {}, 400);

  const user = await USER_REPO.GET_USER(userId as string);

  const data = await FOLLOW_REPO.TARGET_STATUS(
    user?._id!,
    targetType as string,
    Number(artistId),
    new Types.ObjectId(target as any)
  );

  if (!data) return handleResponse(res, false, '', { isFollowed: false });

  return handleResponse(res, true, '', { isFollowed: true });
});

const getFollowedTargets = asyncHandler(async (req: Request, res: Response) => {
  const {
    auth: { userId },
    params: { targetType },
  } = req;

  const user = await USER_REPO.GET_USER(userId as string);

  const followedTargets = await FOLLOW_REPO.GET_FOLLOWED_TARGETS(
    user?._id!,
    targetType as string
  );

  return handleResponse(res, true, '', { followedTargets });
});

export const FOLLOW_CONTROLLER = {
  FOLLOW_TARGET: followTarget,
  UNFOLLOW_TARGET: unfollowTarget,
  TARGET_STATUS: targetStatus,
  GET_FOLLOWED_TARGETS: getFollowedTargets,
};
