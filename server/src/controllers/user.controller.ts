import { Request, Response } from 'express';
import { handleResponse } from '../lib/response';
import { asyncHandler } from '../lib/wrapper';
import { MESSAGE_REPO } from '../repos/message.repo';
import { USER_REPO } from '../repos/user.repo';

const getUser = asyncHandler(async (req: Request, res: Response) => {
  const {
    auth: { userId },
  } = req;
  const user = await USER_REPO.GET_USER(String(userId));

  return handleResponse(res, true, '', { user });
});

const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const {
    auth: { userId },
  } = req;
  const users = await USER_REPO.GET_USERS(String(userId));

  return handleResponse(res, true, '', { users, total: users.length });
});

const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const {
    auth: { userId },
    body: { fullName },
  } = req;

  await USER_REPO.UPDATE_USER(userId as string, fullName as string);

  return handleResponse(res, true, 'Profile updated sucessfully');
});

const updateExplicitContent = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      auth: { userId },
    } = req;

    const user = await USER_REPO.GET_USER(userId as string);

    if (user?.explicitContent) {
      await USER_REPO.UPDATE_EXPLICIT(userId as string, false);
      return handleResponse(res, true, 'Explicit content is Off.', {
        explicitContent: !user?.explicitContent,
      });
    } else {
      await USER_REPO.UPDATE_EXPLICIT(userId as string, true);
      return handleResponse(res, true, 'Explicit content is On.', {
        explicitContent: !user?.explicitContent,
      });
    }
  }
);

const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const {
    auth: { userId },
    params: { recipientId },
  } = req;
  const messages = await MESSAGE_REPO.GET_MESSAGES(
    String(userId),
    String(recipientId)
  );

  return handleResponse(res, true, '', { messages });
});

const markSeen = asyncHandler(async (req: Request, res: Response) => {
  const {
    params: { messageId },
  } = req;
  const message = await MESSAGE_REPO.SEEN(String(messageId));

  return handleResponse(res, true, '', { message });
});

export const USER_CONTROLLER = {
  GET_USER: getUser,
  GET_USERS: getUsers,
  GET_MESSAGES: getMessages,
  UPDATE_USER: updateUser,
  UPDATE_EXPLICIT: updateExplicitContent,
  SEEN: markSeen,
};
