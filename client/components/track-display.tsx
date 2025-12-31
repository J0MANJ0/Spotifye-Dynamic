'use client';

import { useNavigationHistory } from '@/hooks/use-nav';
import { bgGradientDisplay } from '@/lib/utils';

import { usePlayerStore } from '@/stores/use-player-store';
import { useEffect, useState } from 'react';

type Gradient = {
  bg: string;
  text: string;
};
export const SongDisplay = () => {
  const { currentTrack, isPlaying } = usePlayerStore();
  const { router } = useNavigationHistory();
  const [mounted, setMounted] = useState(false);
  const [gradient, setGradient] = useState<Gradient>({
    bg: '#250001',
    text: '#fff',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!currentTrack) return;
    setGradient(bgGradientDisplay());
  }, [currentTrack?.trackId]);

  if (!mounted) return null;

  return (
    <div
      className='flex justify-between items-center mx-auto w-full p-3 rounded-[2px] transition-all duration-200'
      style={{
        backgroundColor: `${gradient.bg}80`,
      }}
    >
      <div className='h-5 w-5 rounded-full p-2 bg-inherit opacity-0' />
      <div className='flex justify-center items-center font-bold text-xl'>
        <h3>
          {isPlaying ? (
            <span
              className='hover:underline cursor-pointer'
              onClick={() =>
                router.push(`/albums/${currentTrack?.data.album.id}`)
              }
            >
              {currentTrack?.data.title}-{currentTrack?.data.artist.name}-
              {currentTrack?.trackId}
            </span>
          ) : (
            <span>Spotifye-Free</span>
          )}
        </h3>
      </div>
      <div>User</div>
    </div>
  );
};
