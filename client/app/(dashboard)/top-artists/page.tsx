'use client';

import { FollowArtistTop } from '@/components/follow-artist-top-card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useChartStore } from '@/stores/use-chart-store';
import { useMemo } from 'react';

const TopArtistsPage = () => {
  const { artists } = useChartStore();

  const followed = useMemo(() => {
    const filtered = artists;
    return filtered?.sort(() => Math.random() - 0.5);
  }, [artists]);
  return (
    <ScrollArea className='h-full w-full rounded-md bg-zinc-900 p-4'>
      <div>
        <div className='flex flex-col w-full p-4 gap-4'>
          <div className='flex justify-start items-center'>
            <h2 className='text-2xl font-semibold text-white'>
              Top artists this month
            </h2>
          </div>
          <div className='grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5'>
            {followed?.map((artist, i) => (
              <FollowArtistTop key={i} artist={artist} />
            ))}
          </div>
        </div>
      </div>
      <ScrollBar orientation='vertical' />
    </ScrollArea>
  );
};
export default TopArtistsPage;
