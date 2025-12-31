'use client';

import { ChatHeader } from '@/components/chat-header';
import { MessageInput } from '@/components/message-input';
import { NoConversationPlaceholder } from '@/components/no-conversation';
import { Topbar } from '@/components/top-bar';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UsersList } from '@/components/users-list';
import { useChatStore } from '@/stores/use-chat-store';
import { useUser } from '@clerk/nextjs';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useRef } from 'react';

const ChatPage = () => {
  const { user } = useUser();
  const { messages, selectedUser, fetchMessages, fetchUsers, markSeen } =
    useChatStore();

  const scrollEnd = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  useEffect(() => {
    if (selectedUser && user) {
      messages.forEach((msg) => {
        if (msg.senderId === selectedUser.clerkId && !msg.seen) {
          markSeen(msg._id);
        }
      });
    }
  }, [messages, selectedUser, user, markSeen]);

  useEffect(() => {
    if (scrollEnd.current && messages.length > 0) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser.clerkId);
  }, [selectedUser, fetchMessages]);
  return (
    <div className='rounded-md h-full bg-linear-to-b from-zinc-800 to-zinc-900 overflow-hidden'>
      <Topbar />

      <div className='grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-280px)]'>
        <UsersList />
        <div className='flex flex-col h-full'>
          {selectedUser ? (
            <>
              <ChatHeader />

              <ScrollArea className='h-[calc(100vh-380px)]'>
                <div className='p-4 space-y-4'>
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex items-start gap-4 ${
                        message.senderId === user?.id ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <Avatar className='size-8'>
                        <AvatarImage
                          src={
                            message.senderId === user?.id
                              ? user.imageUrl
                              : selectedUser.imageUrl
                          }
                        />
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 max-w-[70%]
													${
                            message.senderId === user?.id
                              ? message.seen
                                ? 'bg-green-500'
                                : 'bg-zinc-900'
                              : 'bg-zinc-800'
                          }
												`}
                      >
                        <p className='text-sm'>{message.content}</p>
                        <span className='text-xs text-zinc-300 mt-1 block'>
                          {formatDistanceToNow(message.createdAt, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <MessageInput />
            </>
          ) : (
            <NoConversationPlaceholder />
          )}
        </div>
      </div>
    </div>
  );
};
export default ChatPage;
