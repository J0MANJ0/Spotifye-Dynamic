import express, { Request, Response } from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { clerkMiddleware } from '@clerk/express';
import { ENV } from './lib/env';
import api from './api/api';
import { ERROR_MIDDLEWARE } from './middlewares/error.middleware';

const app = express();

// middlewares
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
app.use(clerkMiddleware());

// error

app.get('/health', (_: Request, res: Response) => {
  return res.status(200).json({
    status: 'LIVE 🔥',
    mode: ENV.NODE_ENV,
    websockets: ENV.ENABLE_SOCKETS === 'true' ? 'enabled' : 'disabled',
  });
});

// status
app.get('/', (_: Request, res: Response) => {
  return res.status(200).json({
    status: 'LIVE ⏺️',
    mode: ENV.NODE_ENV,
    deployment: process.env.VERCEL
      ? 'Vercel'
      : process.env.RENDER
      ? 'Render'
      : 'Local',
  });
});

app.use('/api/v1', api);
app.use('/api/v2', api);

// error handler
app.use(ERROR_MIDDLEWARE.ERROR);

export default app;
