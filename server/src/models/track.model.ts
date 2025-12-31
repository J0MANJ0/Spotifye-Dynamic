import { Schema, Document, model, Types } from 'mongoose';

export interface ITrackCache extends Document {
  trackId: number;
  albumId: Types.ObjectId;
  audioUrl: string;
  duration: number;
  data: Record<string, any>;
}

const trackSchema = new Schema<ITrackCache>(
  {
    trackId: { type: Number, required: true },
    albumId: { type: Schema.Types.ObjectId, required: true, ref: 'albums' },
    audioUrl: { type: String, required: true },
    duration: { type: Number, required: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const TRACKCACHE = model<ITrackCache>('tracks', trackSchema);
