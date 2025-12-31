'use client';

import { usePlayerStore } from '@/stores/use-player-store';
import { CreditsArtistCard } from './credits-artist-card';
import { CreditsDialog } from './credits-dialog';

export const CreditsCard = () => {
  const { currentTrack } = usePlayerStore();
  if (!currentTrack) return;

  return (
    <div className='flex w-full bg-zinc-800 rounded-md'>
      <div className='flex flex-col w-full p-4 gap-3'>
        <div className='flex justify-between items-center'>
          <h3 className='text-md font-semibold'>Credits</h3>
          <CreditsDialog />
        </div>
        {currentTrack.data.contributors.map((c, i) => {
          return c && <CreditsArtistCard artist={c} key={i} />;
        })}
      </div>
    </div>
  );
};
