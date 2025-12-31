import { Schema, Document, model } from 'mongoose';

export interface ILyrics extends Document {
  songId: number;
  albumId: number;
  artistId: number;
  lyrics: string;
}

const lyricsSchema = new Schema<ILyrics>(
  {
    songId: { type: Number, required: true, unique: true },
    albumId: { type: Number },
    artistId: { type: Number },
    lyrics: { type: String, required: true },
  },
  { timestamps: true }
);

export const LYRICSCACHE = model<ILyrics>('lyrics', lyricsSchema);
