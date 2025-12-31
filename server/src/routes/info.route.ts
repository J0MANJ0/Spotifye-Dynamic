import { INFO_CONTROLLER } from 'controllers/info.controller';
import { Router } from 'express';
import { AUTH_MIDDLEWARE } from 'middlewares/auth.middlewares';

const infoRouter = Router();

infoRouter.use(AUTH_MIDDLEWARE.PROTECT);

infoRouter.get('/current', INFO_CONTROLLER.GET_INFO);

export default infoRouter;
