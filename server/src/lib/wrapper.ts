import { Request, Response, NextFunction } from 'express';
import { handleResponse } from './response';

type AsyncMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = (fn: AsyncMiddleware) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((error) => {
      console.log('Error in catch block:', error);
      return handleResponse(
        res,
        false,
        error?.message || 'Internal Server Error!',
        { error },
        error?.status || 500
      );
    });
  };
};
