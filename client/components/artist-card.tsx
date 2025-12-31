'use client';

import { useEffect } from 'react';
import { Button } from './ui/button';
import { useMusicStore } from '@/stores/use-music-store';
import { useNavigationHistory } from '@/hooks/use-nav';
import { useFollowStore } from '@/stores/use-follow-store';
import { usePlayerStore } from '@/stores/use-player-store';

export const ArtistCard = () => {
  const { fetchArtist, artist } = useMusicStore();
  const { followedArtists, followTarget, unfollowTarget } = useFollowStore();
  const { currentTrack } = usePlayerStore();
  const { router } = useNavigationHistory();

  useEffect(() => {
    if (currentTrack) fetchArtist(currentTrack?.data?.artist?.id!);
  }, [currentTrack?.data?.artist?.id, currentTrack, fetchArtist]);

  const isFollowed = followedArtists?.some(
    (a) => a.target?.data?.id === artist?.data?.id
  );

  const handleSubmit = () => {
    isFollowed
      ? unfollowTarget('artists', artist?.data?.id)
      : followTarget('artists', artist?.data?.id);
  };

  if (!currentTrack) return;
  return (
    <div className='bg-zinc-800 rounded-md w-full'>
      <div className='w-full relative'>
        <img
          src={artist?.data?.picture_xl}
          alt=''
          className='w-full h-[2/1] object-cover rounded-t-md brightness-65'
        />
        <span className='absolute top-4 left-3 text-sm font-semibold'>
          About the artist
        </span>
      </div>
      <div className='flex flex-col w-full'>
        <div className='flex justify-start items-center p-4'>
          <h3
            className='font-semibold text-md hover:underline cursor-pointer'
            onClick={() => router.push(`/artists/${artist?.data?.id}`)}
          >
            {artist?.data?.name}
          </h3>
        </div>
        <div className='flex justify-between items-center w-full px-4 my-3'>
          <div>
            <span className='text-sm text-gray-300'>
              {Number(artist?.data?.nb_fan).toLocaleString('en-US')} monthly
              listeners
            </span>
          </div>
          <div>
            <Button
              className='flex items-center justify-center rounded-2xl bg-zinc-900 text-white text-xs px-8 border border-gray-400 hover:scale-102  hover:border-gray-200 hover:bg-zinc-800 cursor-pointer'
              onClick={handleSubmit}
            >
              {isFollowed ? 'Unfollow' : 'Follow'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
