import { LYRICS_CONTROLLER } from '../controllers/lyrics.controller';
import { Router } from 'express';

const lyricsRouter = Router();

const { GET_LYRICS, SEARCH_LYRICS, GET_ALL_LYRICS, SEARCH_LRC_LYRICS } =
  LYRICS_CONTROLLER;

lyricsRouter.get('/:trackId', GET_LYRICS);
lyricsRouter.get('/', SEARCH_LYRICS);
lyricsRouter.get('/search/lrc', SEARCH_LRC_LYRICS);
lyricsRouter.get('/list/all', GET_ALL_LYRICS);

export default lyricsRouter;
