import { Schema, Document, model } from 'mongoose';

export interface IArtist extends Document {
  artistId: number;
  data: object;
}

const artistSchema = new Schema<IArtist>(
  {
    artistId: { type: Number, required: true, unique: true },
    data: { type: Object, required: true },
  },
  { timestamps: true }
);

export const ARTISTCACHE = model<IArtist>('artists', artistSchema);
