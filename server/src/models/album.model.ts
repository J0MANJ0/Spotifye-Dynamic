import { Schema, Document, model, Types } from 'mongoose';

export interface IAlbumCache extends Document {
  albumId: number;
  data: Record<string, any>;
  tracks: Types.ObjectId[];
}

const albumSchema = new Schema<IAlbumCache>(
  {
    albumId: { type: Number, required: true, unique: true },
    data: { type: Object, required: true },
    tracks: [{ type: Schema.Types.ObjectId, ref: 'tracks' }],
  },
  { timestamps: true }
);

export const ALBUMCACHE = model<IAlbumCache>('albums', albumSchema);
