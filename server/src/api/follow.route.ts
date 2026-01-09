import { FOLLOW_CONTROLLER } from '../../src/controllers/follow.controller';
import { Router } from 'express';
import { AUTH_MIDDLEWARE } from '../../src/middlewares/auth.middlewares';

const followRouter = Router();

const { FOLLOW_TARGET, UNFOLLOW_TARGET, GET_FOLLOWED_TARGETS, TARGET_STATUS } =
  FOLLOW_CONTROLLER;

followRouter.use(AUTH_MIDDLEWARE.PROTECT);

followRouter.get('/status', TARGET_STATUS);
followRouter.get('/targets/:targetType', GET_FOLLOWED_TARGETS);
followRouter.post('/', FOLLOW_TARGET);
followRouter.delete('/unfollow', UNFOLLOW_TARGET);

export default followRouter;
