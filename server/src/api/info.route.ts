import { INFO_CONTROLLER } from '../../src/controllers/info.controller';
import { Router } from 'express';
import { AUTH_MIDDLEWARE } from '../../src/middlewares/auth.middlewares';

const infoRouter = Router();

infoRouter.use(AUTH_MIDDLEWARE.PROTECT);

infoRouter.get('/current', INFO_CONTROLLER.GET_INFO);

export default infoRouter;
