import { NextFunction, Request, Response } from 'express';
import { handleResponse } from '../lib/response';

const errorHandler = async (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Error in error handler middleware:', err);

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
