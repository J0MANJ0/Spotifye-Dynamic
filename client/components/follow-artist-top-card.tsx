'use client';

import { ArtistData } from '@/types';
import { PlayBtnFollow } from './play-btn-follow';
import { useNavigationHistory } from '@/hooks/use-nav';

type Props = {
  artist: ArtistData;
};

export const FollowArtistTop = ({ artist }: Props) => {
  const { router } = useNavigationHistory();
  return (
    <div className='p-4 rounded-md hover:bg-zinc-800/40 transition-all group cursor-pointer'>
      <div className='mb-4'>
        <div className='relative aspect-square rounded-md shadow-lg overflow-hidden'>
          <img
            src={artist?.picture_xl}
            alt={artist?.name}
            className='h-full w-full object-cover transition-transform duration-300 group rounded-full'
          />
          <PlayBtnFollow />
        </div>
      </div>
      <h3
        className='font-medium mb-2 truncate hover:underline'
        onClick={() => router.push(`/artists/${artist?.id}`)}
      >
        {artist?.name}
      </h3>
      <span
        className='text-zinc-400 text-sm truncate'
        onClick={() => router.push(`/artists/${artist?.id}`)}
      >
        {artist?.type.charAt(0).toUpperCase() + artist?.type.slice(1)}
      </span>
    </div>
  );
};
