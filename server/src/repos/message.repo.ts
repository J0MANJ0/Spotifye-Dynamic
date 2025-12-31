import { MESSAGECACHE } from 'models/message.model';

const getMessages = async (senderId: string, recipientId: string) => {
  return await MESSAGECACHE.find({
    $or: [
      { senderId: recipientId, recipientId: senderId },
      { senderId, recipientId },
    ],
  }).sort({ createdAt: 1 });
};

const sendMessage = async (
  senderId: string,
  recipientId: string,
  content: string
) => {
  return await MESSAGECACHE.create({
    senderId,
    recipientId,
    content,
  });
};

const markSeen = async (messageId: string) => {
  return await MESSAGECACHE.findByIdAndUpdate(
    messageId,
    { seen: true },
    { new: true }
  );
};

export const MESSAGE_REPO = {
  GET_MESSAGES: getMessages,
  SEND_MESSAGE: sendMessage,
  SEEN: markSeen,
};
