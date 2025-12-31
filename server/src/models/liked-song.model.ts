import { Schema, Document, model, Types } from 'mongoose';

export interface ILikedSong extends Document {
  userId: string;
  tracks: Types.ObjectId[];
}

const likedSongSchema = new Schema<ILikedSong>(
  {
    userId: { type: String, required: true, index: true },
    tracks: [{ type: Schema.Types.ObjectId, ref: 'tracks' }],
  },
  { timestamps: true }
);

export const LIKEDSONGCACHE = model<ILikedSong>('liked-songs', likedSongSchema);
