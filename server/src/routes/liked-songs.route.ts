import { LIKEDSONG_CONTROLLER } from '../controllers/liked-song.controller';
import { Router } from 'express';

const likedSongsRouter = Router();

const { GET_LIKEDSONGS, LIKE, UNLIKE } = LIKEDSONG_CONTROLLER;

likedSongsRouter.get('/', GET_LIKEDSONGS);
likedSongsRouter.patch('/like/:trackId', LIKE);
likedSongsRouter.patch('/unlike/:trackId', UNLIKE);

export default likedSongsRouter;
