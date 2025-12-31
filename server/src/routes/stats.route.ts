import { STATS_CONTROLLER } from 'controllers/stats.controller';
import { Router } from 'express';
import { AUTH_MIDDLEWARE } from 'middlewares/auth.middlewares';

const statsRouter = Router();

const { PROTECT, CHECK_ADMIN } = AUTH_MIDDLEWARE;

statsRouter.use(PROTECT, CHECK_ADMIN);

statsRouter.get('/', STATS_CONTROLLER.STATS);

export default statsRouter;
