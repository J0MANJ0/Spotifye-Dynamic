import { Schema, Document, Types, model } from 'mongoose';

export type FollowTarget = 'users' | 'artists';

export interface IFollow extends Document {
  follower: Types.ObjectId;
  target: Types.ObjectId;
  targetType: FollowTarget;
}

const followSchema = new Schema<IFollow>(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    target: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'targetType',
    },
    targetType: {
      type: String,
      enum: ['users', 'artists'],
    },
  },
  { timestamps: true }
);

export const FOLLOWCACHE = model<IFollow>('follows', followSchema);
