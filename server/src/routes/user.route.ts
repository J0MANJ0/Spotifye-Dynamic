import { USER_CONTROLLER } from 'controllers/user.controller';
import { Router } from 'express';
import { AUTH_MIDDLEWARE } from 'middlewares/auth.middlewares';

const userRouter = Router();

const { GET_MESSAGES, GET_USER, GET_USERS, SEEN, UPDATE_USER } =
  USER_CONTROLLER;

userRouter.use(AUTH_MIDDLEWARE.PROTECT);

userRouter.get('/', GET_USERS);
userRouter.get('/user', GET_USER);
userRouter.get('/messages/:recipientId', GET_MESSAGES);
userRouter.get('/seen/:messageId', SEEN);
userRouter.patch('/update', UPDATE_USER);

export default userRouter;
