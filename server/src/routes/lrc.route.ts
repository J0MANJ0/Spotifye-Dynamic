import { LRC_CONTROLLER } from 'controllers/lrc.controller';
import { Router } from 'express';

const lrcRouter = Router();

lrcRouter.get('/:trackId', LRC_CONTROLLER.GET_LRC);

export default lrcRouter;
