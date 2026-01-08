import { MUSIC_CONTROLLER } from '../controllers/music.controller';
import { Router } from 'express';

const musicRouter = Router();

musicRouter.get('/search', MUSIC_CONTROLLER.SEARCH_MUSIC);

export default musicRouter;
