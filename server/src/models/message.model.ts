import { Schema, Document, model } from 'mongoose';

export interface IMessage extends Document {
  senderId: string;
  recipientId: string;
  content: string;
  seen: boolean;
}

const messageSchema = new Schema<IMessage>(
  {
    senderId: { type: String, required: true },
    recipientId: { type: String, required: true },
    content: { type: String, required: true },
    seen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MESSAGECACHE = model<IMessage>('messages', messageSchema);
