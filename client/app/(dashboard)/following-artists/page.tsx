'use client';

import { FollowArtistCard } from '@/components/follow-artist-card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useFollowStore } from '@/stores/use-follow-store';
import { useMemo } from 'react';

const FollowingArtistsPage = () => {
  const { followedArtists } = useFollowStore();

  const followed = useMemo(() => {
    const filtered = followedArtists;
    return filtered?.sort(() => Math.random() - 0.5);
  }, [followedArtists]);
  return (
    <ScrollArea className='h-full w-full rounded-md bg-zinc-900 p-4'>
      <div>
        <div className='flex flex-col w-full p-4 gap-4'>
          <div className='flex justify-start items-center'>
            <h2 className='text-2xl font-semibold text-white'>Following</h2>
          </div>
          <div className='grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6'>
            {followed?.map((artist, i) => (
              <FollowArtistCard key={i} artist={artist} />
            ))}
          </div>
        </div>
      </div>
      <ScrollBar orientation='vertical' />
    </ScrollArea>
  );
};
export default FollowingArtistsPage;
