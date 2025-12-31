import { Schema, Document, model } from 'mongoose';

export interface IPlaybackState extends Document {
  userId: string;
  state: any;
  lastUpdated: Date;
  lastDevice?: string;
}

const PlaybackStateSchema = new Schema<IPlaybackState>(
  {
    userId: { type: String, required: true, unique: true },
    state: { type: Schema.Types.Mixed, required: true },
    lastUpdated: { type: Date, default: Date.now },
    lastDevice: { type: String },
  },
  { timestamps: true }
);

export const PLAYBACKSTATE = model<IPlaybackState>(
  'playback_state',
  PlaybackStateSchema
);
