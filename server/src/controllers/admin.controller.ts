import { Request, Response } from 'express';
import { handleResponse } from '../lib/response';
import { UPLOAD } from '../lib/upload';
import { asyncHandler } from '../lib/wrapper';
import { ALBUMCACHE } from '../models/album.model';
import { TRACKCACHE } from '../models/track.model';
import { ALBUM_REPO } from '../repos/album.repo';
import { ARTIST_REPO } from '../repos/artist.repo';
import { TRACK_REPO } from '../repos/track.repo';
import { ALBUM_SERVICE } from '../services/album.service';
import { ARTIST_SERVICE } from '../services/artist.service';
import { TRACK_SERVICE } from '../services/track.service';
import fileUpload from 'express-fileupload';
import { Schema, Types } from 'mongoose';

interface CreateTrack {
  trackId: number;
  albumId: Schema.Types.ObjectId;
  duration: number;
}

const createTrack = asyncHandler(
  async (req: Request<{}, {}, CreateTrack>, res: Response) => {
    const files = req.files as {
      audioFile?: fileUpload.UploadedFile;
    };

    if (!files?.audioFile)
      return handleResponse(res, false, 'Please upload audio file', {}, 400);
    const {
      body: { trackId, albumId, duration },
    } = req;

    if (!trackId || !albumId || !duration)
      return handleResponse(res, false, 'Missing field(s)', {}, 400);

    const audioUrl = await UPLOAD.UPLOAD_FILE(files.audioFile);

    const data = await TRACK_SERVICE.FETCH_TRACK(Number(trackId));

    const newTrack = await TRACKCACHE.create({
      trackId,
      albumId: new Types.ObjectId(String(albumId)),
      audioUrl,
      duration,
      data,
    });

    if (albumId) {
      await ALBUMCACHE.findByIdAndUpdate(albumId, {
        $push: { tracks: newTrack?._id },
      });
    }

    return handleResponse(res, true, 'Track uploaded successfully', {}, 201);
  }
);

const createAlbum = asyncHandler(async (req: Request, res: Response) => {
  const {
    body: { albumId },
  } = req;

  const data = await ALBUM_SERVICE.FETCH_ALBUM(Number(albumId));

  const artist = await ARTIST_SERVICE.FETCH_ARTIST(Number(data?.artist.id));

  await ALBUM_REPO.SAVE_ALBUM(Number(albumId), data);

  await ARTIST_REPO.SAVE_ARTIST(Number(artist.id), artist);

  return handleResponse(res, true, 'Album uploaded successfully', {}, 201);
});

const deleteTrack = asyncHandler(async (req: Request, res: Response) => {
  const {
    params: { trackId },
  } = req;

  const song = await TRACK_REPO.GET_TRACK(String(trackId));

  if (song?.albumId) {
    await ALBUMCACHE.findByIdAndUpdate(song.albumId, {
      $pull: { songs: song._id },
    });
  }

  await TRACK_REPO.DELETE_TRACK(String(trackId));

  return handleResponse(res, true, 'Track deleted successfully');
});

const deleteAlbum = asyncHandler(async (req: Request, res: Response) => {
  const {
    params: { albumId },
  } = req;

  let id: any = '';
  if (albumId) id = albumId;

  await TRACKCACHE.deleteMany({ albumId: id });

  await ALBUM_REPO.DELETE_ALBUM(albumId);

  return handleResponse(res, true, 'Album deleted successfully');
});

const checkAdmin = asyncHandler(async (_req: Request, res: Response) => {
  return handleResponse(res, true, '', { admin: true });
});

export const ADMIN_CONTROLLER = {
  CREATE_TRACK: createTrack,
  CREATE_ALBUM: createAlbum,
  DELETE_TRACK: deleteTrack,
  DELETE_ALBUM: deleteAlbum,
  ADMIN: checkAdmin,
};
