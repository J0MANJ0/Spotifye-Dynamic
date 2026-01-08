import { ALBUM_CONTROLLER } from '../controllers/album.controller';
import { Router } from 'express';

const albumRouter = Router();

const { GET_ALBUM, GET_ALBUMS } = ALBUM_CONTROLLER;

albumRouter.get('/', GET_ALBUMS);
albumRouter.get('/:albumId', GET_ALBUM);

export default albumRouter;
