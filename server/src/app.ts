import express, { Request, Response } from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { clerkMiddleware } from '@clerk/express';
import { AUTH_MIDDLEWARE } from './middlewares/auth.middlewares';
import { ENV } from './lib/env';
import api from './api';

const app = express();

// middlewares
app.use(clerkMiddleware());
if (ENV.NODE_ENV === 'production') {
  app.use(AUTH_MIDDLEWARE.PROTECT_SOCKET);
}
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(
  fileUpload({
    useTempFiles: false,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  })
);

// error
import { ERROR_MIDDLEWARE } from './middlewares/error.middleware';

// status
app.get('/', (_: Request, res: Response) => {
  return res.status(200).json({
    status: 'LIVE ⏺️',
  });
});

app.use('/api/v1', api);
app.use('/api/v2', api);

// error handler
app.use(ERROR_MIDDLEWARE.ERROR);

export default app;
