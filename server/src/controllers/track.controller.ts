import { Request, Response } from 'express';
import { handleResponse } from '../lib/response';
import { asyncHandler } from '../lib/wrapper';
import { ALBUMCACHE, IAlbumCache } from '../models/album.model';
import { ITrackCache, TRACKCACHE } from '../models/track.model';
import { Types } from 'mongoose';
import { LIKEDSONG_REPO } from '../repos/liked-song.repo';
import { TRACK_REPO } from '../repos/track.repo';
import { TRACK_SERVICE } from '../services/track.service';

const getTrack = asyncHandler(async (req: Request, res: Response) => {
  const {
    params: { trackId },
  } = req;

  const data = await TRACK_SERVICE.FETCH_TRACK(Number(trackId));

  if (!data) return handleResponse(res, false, 'No Track found!', {}, 404);

  return handleResponse(res, true, '', { track: data });
});

const getTrackId = asyncHandler(async (req: Request, res: Response) => {
  const {
    params: { trackId },
  } = req;

  const data = await TRACK_REPO.GET_TRACK(trackId as string);

  if (!data) return handleResponse(res, false, 'No Track found!', {}, 404);

  return handleResponse(res, true, '', { track: data });
});

const getTrackChart = asyncHandler(async (req: Request, res: Response) => {
  const {
    params: { trackId },
  } = req;
  const data = await TRACK_SERVICE.FETCH_TRACK(Number(trackId));

  return handleResponse(res, true, '', { track_chart: data });
});

const getTracks = asyncHandler(async (_req: Request, res: Response) => {
  const data = await TRACK_REPO.GET_TRACKS();

  if (!data) return handleResponse(res, false, 'No Tracks found!', {}, 404);

  return handleResponse(res, true, '', { tracks: data });
});

const getMadeForYou = asyncHandler(async (req: Request, res: Response) => {
  const {
    auth: { userId },
  } = req;

  const liked = await LIKEDSONG_REPO.GET_LIKEDSONGS(String(userId));

  if (!liked || !liked.tracks.length)
    return handleResponse(res, true, '', { tracks: [] });

  const likedTrackIds = liked.tracks
    .map((track: any) => track?._id)
    .filter((id: any) => Types.ObjectId.isValid(id))
    .map((id: any) => new Types.ObjectId(id));

  if (!likedTrackIds.length)
    return handleResponse(res, true, '', { tracks: [] });

  const likedTracks = await TRACKCACHE.find({
    _id: { $in: likedTrackIds },
  })
    .select('albumId')
    .lean();

  const likedAlbumIds = [
    ...new Set(
      likedTracks
        .map((t: ITrackCache) => t.albumId)
        .filter((id: Types.ObjectId) => Types.ObjectId.isValid(String(id)))
        .map((id: Types.ObjectId) => id.toString())
    ),
  ].map((id) => new Types.ObjectId(id));

  if (!likedAlbumIds.length)
    return handleResponse(res, true, '', { tracks: [] });

  const albums = await ALBUMCACHE.find({
    _id: { $in: likedAlbumIds },
  });

  const genreIds = new Set<number>();

  albums.forEach((album: IAlbumCache) => {
    album.data?.genres?.data?.forEach((g: any) => {
      genreIds.add(g.id);
    });
  });

  if (!genreIds.size) return handleResponse(res, true, '', { tracks: [] });

  const candidateAlbums = await ALBUMCACHE.find({
    'data.genres.data.id': { $in: Array.from(genreIds) },
    _id: { $nin: likedAlbumIds },
  });

  if (!candidateAlbums.length)
    return handleResponse(res, true, '', { tracks: [] });

  const candidateAlbumIds = candidateAlbums.map((a: IAlbumCache) => a._id);

  const tracks = await TRACKCACHE.aggregate([
    {
      $match: {
        albumId: { $in: candidateAlbumIds },
        _id: { $nin: likedTrackIds },
      },
    },
    { $sample: { size: 30 } },
    {
      $lookup: {
        from: 'albums',
        localField: 'albumId',
        foreignField: '_id',
        as: 'album',
      },
    },
    { $unwind: '$album' },
  ]);

  return handleResponse(res, true, '', { tracks });
});

export const TRACK_CONTROLLER = {
  GET_TRACK: getTrack,
  GET_TRACKID: getTrackId,
  GET_TRACK_CHART: getTrackChart,
  GET_TRACKS: getTracks,
  GET_MADE_FOR_YOU: getMadeForYou,
};
