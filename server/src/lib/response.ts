import { Response } from 'express';

export const handleResponse = (
  res: Response,
  success: boolean,
  message: string | null,
  data?: Object | null,
  statusCode?: number | null
) => {
  res.status(statusCode || 200).json({
    success,
    message,
    ...(data && { ...data }),
  });
};
