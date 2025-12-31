import { NextFunction, Request, Response } from 'express';
import logger from 'lib/logger';
import { handleResponse } from 'lib/response';

const errorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error in error handler middleware:', err);

  handleResponse(
    res,
    false,
    err?.message || 'Internal Server Error!',
    {},
    err?.statusCode || 500
  );
  next();
};

export const ERROR_MIDDLEWARE = {
  ERROR: errorHandler,
};
