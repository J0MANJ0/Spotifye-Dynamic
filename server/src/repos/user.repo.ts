import { USERCACHE } from 'models/user.model';

const getUser = async (clerkId: string) => {
  return await USERCACHE.findOne({ clerkId });
};

const getUsers = async (clerkId: string) => {
  return await USERCACHE.find({ clerkId: { $ne: clerkId } });
};

const updateUser = async (clerkId: string, fullName: string) => {
  return USERCACHE.findOneAndUpdate({ clerkId }, { fullName });
};

const createUser = async (
  clerkId: string,
  fullName: string,
  imageUrl: string
) => {
  return await USERCACHE.create({ clerkId, fullName, imageUrl });
};

export const USER_REPO = {
  GET_USER: getUser,
  GET_USERS: getUsers,
  CREATE_USER: createUser,
  UPDATE_USER: updateUser,
};
