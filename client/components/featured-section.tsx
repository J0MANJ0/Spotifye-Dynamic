'use client';

import { useChartStore } from '@/stores/use-chart-store';
import { Button } from './ui/button';
import { useNavigationHistory } from '@/hooks/use-nav';

export const FeaturedSection = () => {
  const { tracks: trending } = useChartStore();
  const { router } = useNavigationHistory();
  return (
    <div className='mb-8'>
      <div className='flex items-center justify-between mb-4'>
        <div className='p-2'>
          <h2 className='text-white text-2xl font-bold'>
            Recommended for today
          </h2>
        </div>

        <Button
          className='text-sm text-zinc-400 hover:text-white cursor-pointer'
          variant={'link'}
          onClick={() => router.push('/')}
        >
          Show all
        </Button>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
        {trending &&
          trending.map((track) => (
            <div
              key={track.id}
              onClick={() => router.push(`/albums/${track.album.id}`)}
              className='bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer'
            >
              <div className='mb-4'>
                <div className='relative aspect-square rounded-md shadow-lg overflow-hidden'>
                  <img
                    src={track.album.cover_medium}
                    alt={track.title}
                    className='size-full object-cover transition-transform duration-300 group-hover:scale-105'
                  />
                </div>
              </div>
              <h3 className='font-medium mb-2 truncate'>{track.title}</h3>
              <p className='text-zinc-400 text-sm truncate'>
                {track.artist.name}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};
