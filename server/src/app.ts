import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { clerkMiddleware } from '@clerk/express';

const app = express();

// middlewares
app.use(clerkMiddleware());
// app.use(AUTH_MIDDLEWARE.PROTECT_SOCKET);
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

// music routes
import musicRoutes from 'routes/music.route';

// albums routes
import albumRoutes from 'routes/album.route';

// artists routes
import artistRoutes from 'routes/artist.route';

// chart routes
import chartRoutes from 'routes/chart.route';

// tracks routes
import tracksRoutes from 'routes/track.route';

// info route
import infoRoutes from 'routes/info.route';

// lyrics route
import lyricsRoutes from 'routes/lyrics.route';
import { ENV } from 'lib/env';

// main routes
import userRoutes from 'routes/user.route';
import adminRoutes from 'routes/admin.route';
import authRoutes from 'routes/auth.route';
import statsRoutes from 'routes/stats.route';
import likedSongsRoutes from 'routes/liked-songs.route';
import lrcRoutes from 'routes/lrc.route';
import followRoutes from 'routes/follow.route';

// error
import { ERROR_MIDDLEWARE } from 'middlewares/error.middleware';
import { AUTH_MIDDLEWARE } from 'middlewares/auth.middlewares';

// status
app.get('/', (_, res) => {
  return res.status(200).json({
    status: 'LIVE ⏺️',
  });
});

// music endpoints
app.use('/api/v1/music', musicRoutes);

// albums endpoints
app.use('/api/v1/albums', albumRoutes);

// artist endpoints
app.use('/api/v1/artists', artistRoutes);

// chart endpoints
app.use('/api/v1/chart', chartRoutes);

// tracks endpoints
app.use('/api/v1/tracks', tracksRoutes);

// info endpoint
app.use('/api/v1/info', infoRoutes);

// lyrics endpoint
app.use('/api/v1/lyrics', lyricsRoutes);

// main endpoints
app.use('/api/v2/users', userRoutes);
app.use('/api/v2/admin', adminRoutes);
app.use('/api/v2/auth', authRoutes);
app.use('/api/v2/artists', artistRoutes);
app.use('/api/v2/stats', statsRoutes);
app.use('/api/v2/albums', albumRoutes);
app.use('/api/v2/tracks', tracksRoutes);
app.use('/api/v2/liked-songs', likedSongsRoutes);
app.use('/api/v2/lyrics', lyricsRoutes);
app.use('/api/v2/lrc', lrcRoutes);
app.use('/api/v2/info', infoRoutes);
app.use('/api/v2/follow', followRoutes);
app.use('/api/v2/chart', chartRoutes);

// error handler
app.use(ERROR_MIDDLEWARE.ERROR);

export default app;
