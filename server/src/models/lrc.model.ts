import { Schema, Document, model } from 'mongoose';

interface LyricsField {
  format: 'plain' | 'lrc';
  url: string;
}
export interface ILrc extends Document {
  trackId: number;
  lyrics: LyricsField | null;
}

const lrcSchema = new Schema<ILrc>(
  {
    trackId: { type: Number, required: true, unique: true },
    lyrics: {
      type: {
        format: { type: String, enum: ['plain', 'lrc'], default: 'plain' },
        url: String,
      },
      default: null,
    },
  },
  { timestamps: true }
);

export const LRCCACHE = model<ILrc>('lrc_files', lrcSchema);
