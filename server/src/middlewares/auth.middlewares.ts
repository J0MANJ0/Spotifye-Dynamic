import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from 'lib/wrapper';
import { clerkClient } from '@clerk/express';
import { ENV } from 'lib/env';
import { handleResponse } from 'lib/response';

const requireAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      auth: { userId },
    } = req;

    const user = await clerkClient.users.getUser(userId!);

    const isAdmin = ENV.ADMIN_EMAIL === user.primaryEmailAddress?.emailAddress;

    if (!isAdmin) return handleResponse(res, false, 'Unauthorized', {}, 401);

    next();
  }
);

const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      auth: { userId },
    } = req;

    if (!userId) return handleResponse(res, false, 'Please Sign in!', {}, 401);

    next();
  }
);

const protectSocket = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      auth: { userId },
    } = req;

    if (!userId) return handleResponse(res, false, 'Please Sign in!', {}, 401);

    next();
  }
);

export const AUTH_MIDDLEWARE = {
  CHECK_ADMIN: requireAdmin,
  PROTECT: protect,
  PROTECT_SOCKET: protectSocket,
};
