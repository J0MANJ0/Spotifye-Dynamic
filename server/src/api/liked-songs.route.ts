import { LIKEDSONG_CONTROLLER } from '../controllers/liked-song.controller';
import { Router } from 'express';
import { AUTH_MIDDLEWARE } from '../middlewares/auth.middlewares';

const likedSongsRouter = Router();

const { GET_LIKEDSONGS, LIKE, UNLIKE } = LIKEDSONG_CONTROLLER;

likedSongsRouter.use(AUTH_MIDDLEWARE.PROTECT);

likedSongsRouter.get('/', GET_LIKEDSONGS);
likedSongsRouter.patch('/like/:trackId', LIKE);
likedSongsRouter.patch('/unlike/:trackId', UNLIKE);

export default likedSongsRouter;
