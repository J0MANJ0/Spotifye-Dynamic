import { ADMIN_CONTROLLER } from '../../src/controllers/admin.controller';
import { LRC_CONTROLLER } from '../../src/controllers/lrc.controller';
import { Router } from 'express';
import { AUTH_MIDDLEWARE } from '../../src/middlewares/auth.middlewares';

const adminRouter = Router();

const { CHECK_ADMIN, PROTECT } = AUTH_MIDDLEWARE;
const { ADMIN, CREATE_ALBUM, CREATE_TRACK, DELETE_ALBUM, DELETE_TRACK } =
  ADMIN_CONTROLLER;
const { SAVE_LRC, GET_LRC_FILES } = LRC_CONTROLLER;

adminRouter.use(PROTECT, CHECK_ADMIN);

adminRouter.get('/check', ADMIN);
adminRouter.post('/track', CREATE_TRACK);
adminRouter.post('/album', CREATE_ALBUM);
adminRouter.delete('/track/:trackId/', DELETE_TRACK);
adminRouter.delete('/album/:albumId', DELETE_ALBUM);
adminRouter.post('/lrc/create', SAVE_LRC);
adminRouter.get('/lrc/all', GET_LRC_FILES);

export default adminRouter;
