import { ARTIST_CONTROLLER } from '../controllers/artist.controller';
import { Router } from 'express';

const artistRouter = Router();

const { GET_ARTIST, GET_ARTISTS } = ARTIST_CONTROLLER;

artistRouter.get('/', GET_ARTISTS);
artistRouter.get('/:artistId', GET_ARTIST);

export default artistRouter;
