import { ARTISTCACHE } from 'models/artist.model';
import { FOLLOWCACHE } from 'models/follow.model';
import { USERCACHE } from 'models/user.model';
import { Types } from 'mongoose';

const followTarget = async (
  follower: Types.ObjectId,
  targetType: string,
  artistId?: number | null,
  target?: Types.ObjectId | null
) => {
  if (targetType === 'artists') {
    const artist = await ARTISTCACHE.findOne({ artistId });

    return FOLLOWCACHE.create({ follower, target: artist?._id, targetType });
  } else {
    const user = await USERCACHE.findById(target);
    return FOLLOWCACHE.create({ follower, target: user?._id, targetType });
  }
};

const targetStatus = async (
  follower: Types.ObjectId,
  targetType: string,
  artistId?: number | null,
  target?: Types.ObjectId | null
) => {
  if (targetType === 'artists') {
    const artist = await ARTISTCACHE.findOne({ artistId });
    return FOLLOWCACHE.findOne({ follower, target: artist?._id, targetType });
  } else {
    const user = await USERCACHE.findById(target);

    return FOLLOWCACHE.findOne({ follower, target: user?._id, targetType });
  }
};

const unfollowTarget = async (
  follower: Types.ObjectId,
  targetType: string,
  artistId?: number | null,
  target?: Types.ObjectId | null
) => {
  if (targetType === 'artists') {
    const artist = await ARTISTCACHE.findOne({ artistId });

    return FOLLOWCACHE.deleteOne({ follower, target: artist?._id, targetType });
  } else {
    const user = await USERCACHE.findById(target);
    return FOLLOWCACHE.deleteOne({ follower, target: user?._id, targetType });
  }
};

const getFollowedTargets = async (
  follower: Types.ObjectId,
  targetType: string
) => {
  return await FOLLOWCACHE.find({ follower, targetType })
    .populate('target')
    .lean();
};
export const FOLLOW_REPO = {
  GET_FOLLOWED_TARGETS: getFollowedTargets,
  TARGET_STATUS: targetStatus,
  FOLLOW_TARGET: followTarget,
  UNFOLLOW_TARGET: unfollowTarget,
};
