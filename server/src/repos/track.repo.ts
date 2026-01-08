import { TRACKCACHE } from '../models/track.model';
import { Types } from 'mongoose';

const getTrack = async (trackId: string) => {
  return await TRACKCACHE.findById(trackId);
};

const getTracks = async () => {
  return await TRACKCACHE.find().lean();
};

const deleteTrack = async (trackId: string) => {
  return await TRACKCACHE.findByIdAndDelete(trackId);
};

const saveTrack = async (
  trackId: number,
  albumId: Types.ObjectId,
  duration: number,
  audioUrl: string,
  data: object
) => {
  return await TRACKCACHE.create({
    trackId,
    albumId,
    audioUrl,
    duration,
    data,
  });
};

export const TRACK_REPO = {
  GET_TRACK: getTrack,
  GET_TRACKS: getTracks,
  DELETE_TRACK: deleteTrack,
  SAVE_TRACK: saveTrack,
};
