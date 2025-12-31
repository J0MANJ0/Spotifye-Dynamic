import { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  imageUrl: string;
  clerkId: string;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    clerkId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const USERCACHE = model<IUser>('users', userSchema);
