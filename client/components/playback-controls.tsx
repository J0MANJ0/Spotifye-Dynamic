'use client';
import { PlaySongInfo } from './playsong-info';
import { PlayControls } from './play-controls';
import { PlayInteracts } from './play-interacts';

export const PlaybackControls = () => {
  return (
    <footer className='h-15 bg-black px-4'>
      <div className='flex justify-between items-center h-full gap-6'>
        <PlaySongInfo />
        <PlayControls />

        {/*  */}
        <PlayInteracts />
      </div>
    </footer>
  );
};
