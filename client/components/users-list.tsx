'use client';

import { useChatStore } from '@/stores/use-chat-store';
import { useUser } from '@clerk/nextjs';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { UsersListSkeleton } from './users-skeleton';

type Props = {};
export const UsersList = () => {
  const { user } = useUser();
  const {
    users,
    selectedUser,
    loading,
    setSelectedUser,
    onlineUsers,
    messages,
  } = useChatStore();

  const unseenMessages = users.reduce((acc, u) => {
    const count = messages.filter(
      (msg) =>
        msg.recipientId === user?.id && msg.senderId === u.clerkId && !msg.seen
    ).length;

    acc[u.clerkId] = count;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className='border-r border-zinc-800'>
      <div className='flex flex-col h-full'>
        <ScrollArea className='h-[calc(100vh-280px)]'>
          <div className='space-y-2 p-4'>
            {loading ? (
              <UsersListSkeleton />
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center justify-center lg:justify-start gap-3 p-3 
										rounded-lg cursor-pointer transition-colors
                    ${
                      selectedUser?.clerkId === user.clerkId
                        ? 'bg-green-800'
                        : 'hover:bg-zinc-800/50'
                    }`}
                >
                  <div className='relative'>
                    <Avatar className='size-8 md:size-12'>
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                    </Avatar>

                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-zinc-900
                        ${
                          onlineUsers.has(user.clerkId)
                            ? 'bg-green-500 pulse'
                            : 'bg-zinc-500'
                        }`}
                    />
                  </div>
                  <div className='flex-1 min-w-0 lg:block hidden'>
                    <span className='font-medium truncate'>
                      {user.fullName}
                    </span>
                  </div>
                  <div>
                    {unseenMessages[user.clerkId] > 0 && (
                      <Badge className='h-5 min-w-5 rounded-full px-1 font-mono tabular-nums flex justify-center items-center bg-green-500 text-white'>
                        {unseenMessages[user.clerkId]}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
