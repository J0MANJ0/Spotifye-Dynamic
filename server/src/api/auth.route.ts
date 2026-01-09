import { AUTH_CALLBACK } from '../../src/controllers/auth.controller';
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/callback', AUTH_CALLBACK.CALLBACK);

export default authRouter;
