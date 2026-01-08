'use client';

import { useChatStore } from '@/stores/use-chat-store';
import { useUser } from '@clerk/nextjs';
import { HeadphonesIcon, Music, Users } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useFollowStore } from '@/stores/use-follow-store';
import { Button } from './ui/button';
import { useMemo } from 'react';

export const UsersActivities = () => {
  const { user } = useUser();
  const { followedUsers, FollowArtist, unFollowArtist } = useFollowStore();
  const { usersActivities, users, onlineUsers } = useChatStore();

  const usersList = useMemo(() => {
    return users;
  }, [followedUsers, users]);

  return (
    <div className='h-full bg-zinc-900 rounded-lg flex flex-col'>
      <div className='p-4 flex justify-between items-center border-b border-zinc-800'>
        <div className='flex items-center gap-2'>
          <Users className='size-5 shrink-0' />
          <h2 className='font-semibold'>What they&#39;re listening to</h2>
        </div>
      </div>
      {!user && <LoginPrompt />}

      <ScrollArea className='flex-1'>
        <div className='p-4 space-y-4'>
          {usersList.map((user) => {
            const activity = usersActivities.get(user.clerkId);

            const isPlaying = activity && activity !== 'Idle';
            const isFollowed = followedUsers.some(
              (u) => u.target.clerkId === user.clerkId
            );

            const handleFollow = () => {
              isFollowed
                ? unFollowArtist('users', null, user._id)
                : FollowArtist('users', null, user._id);
            };
            return (
              <div
                className='cursor-pointer hover:bg-zinc-800/50 rounded-md transition-colors group py-2'
                key={user._id}
              >
                <div className='flex items-start gap-3'>
                  <div className='relative'>
                    <Avatar className='size-10 border border-zinc-800'>
                      <AvatarImage src={user.imageUrl} alt={user.fullName} />
                      <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-zinc-900 ${
                        onlineUsers.has(user.clerkId)
                          ? 'bg-green-500 pulse'
                          : 'bg-zinc-400'
                      }`}
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2'>
                      <span className='font-medium text-sm text-white'>
                        {user.fullName}
                      </span>
                      {isPlaying && (
                        <Music className='size-3.5 text-emerald-400 shrink-0 animate-pulse transition-all' />
                      )}
                    </div>

                    {isPlaying ? (
                      <div className='mt-1'>
                        <div className='mt-1 text-sm text-green-400 font-medium truncate'>
                          {activity.replace('Playing ', '').split(' by ')[0]}
                        </div>
                        <div className='text-xs text-zinc-400 truncate'>
                          {activity.split(' by ')[1]}
                        </div>
                      </div>
                    ) : (
                      <div className='mt-1 text-xs text-zinc-400'>
                        {onlineUsers.has(user.clerkId) && 'Idle'}
                      </div>
                    )}
                  </div>
                  <div>
                    <Button
                      className='flex items-center justify-center rounded-2xl bg-zinc-900 text-white text-xs px-8 border border-gray-400 hover:scale-102 hover:border-gray-200 hover:bg-zinc-800 cursor-pointer'
                      onClick={handleFollow}
                    >
                      {isFollowed ? 'Following' : 'Follow'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

const LoginPrompt = () => (
  <div className='h-full flex flex-col items-center justify-center p-6 text-center space-y-4'>
    <div className='relative'>
      <div
        className='absolute -inset-1 bg-linear-to-r from-emerald-500 to-sky-500 rounded-full blur-lg
       opacity-75 animate-pulse'
        aria-hidden='true'
      />
      <div className='relative bg-zinc-900 rounded-full p-4'>
        <HeadphonesIcon className='size-8 text-emerald-400' />
      </div>
    </div>

    <div className='space-y-2 max-w-[250px]'>
      <h3 className='text-lg font-semibold text-white'>
        See What Friends Are Playing
      </h3>
      <p className='text-sm text-zinc-400'>
        Login to discover what music your friends are enjoying right now
      </p>
    </div>
  </div>
);
