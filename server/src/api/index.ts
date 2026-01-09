import { Request, Response, Router } from 'express';
import admin from './admin.route';
import albums from './album.route';
import artists from './artist.route';
import auth from './auth.route';
import chart from './chart.route';
import follow from './follow.route';
import info from './info.route';
import likedSongs from './liked-songs.route';
import lrc from './lrc.route';
import lyrics from './lyrics.route';
import music from './music.route';
import stats from './stats.route';
import tracks from './track.route';
import users from './user.route';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'live-route',
    message: 'ACTIVE 🔥',
  });
});

router.use('/admin', admin);
router.use('/albums', albums);
router.use('/artists', artists);
router.use('/auth', auth);
router.use('/users', users);
router.use('/chart', chart);
router.use('/follow', follow);
router.use('/info', info);
router.use('/liked-songs', likedSongs);
router.use('/lrc', lrc);
router.use('/lyrics', lyrics);
router.use('/music', music);
router.use('/stats', stats);
router.use('/tracks', tracks);

export default router;
