import { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  imageUrl: string;
  clerkId: string;
  explicitContent: boolean;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    clerkId: { type: String, required: true, unique: true },
    explicitContent: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const USERCACHE = model<IUser>('users', userSchema);
