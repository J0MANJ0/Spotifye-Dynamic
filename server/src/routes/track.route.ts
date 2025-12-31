import { TRACK_CONTROLLER } from 'controllers/track.controller';
import { Router } from 'express';
import { AUTH_MIDDLEWARE } from 'middlewares/auth.middlewares';

const tracksRouter = Router();
const { GET_TRACK, GET_TRACKS, GET_TRACK_CHART, GET_MADE_FOR_YOU } =
  TRACK_CONTROLLER;

tracksRouter.get('/', GET_TRACKS);
tracksRouter.get('/:trackId', GET_TRACK);
tracksRouter.get('/chart/:trackId', GET_TRACK_CHART);
tracksRouter.get('/user/madeforyou', AUTH_MIDDLEWARE.PROTECT, GET_MADE_FOR_YOU);

export default tracksRouter;
