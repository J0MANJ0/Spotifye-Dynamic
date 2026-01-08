'use client';

import { useMusicStore } from '@/stores/use-music-store';
import { usePlayerStore } from '@/stores/use-player-store';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import { useMemo } from 'react';

export const ShowActiveDevice = () => {
  const { isActive, devices } = usePlayerStore();
  const { selectedstate, setState } = useMusicStore();

  const activeDevice = useMemo(() => {
    return devices.find((d) => d.isActive);
  }, [devices]);
  return (
    !isActive &&
    devices.length > 1 && (
      <footer className='w-full rounded-[3px] p-3 flex justify-end bg-green-400 h-6 my-2'>
        <div className='flex justify-start items-center gap-2'>
          <VolumeUpRoundedIcon fontSize='small' sx={{ color: '#000' }} />
          <span
            className='text-sm font-semibold text-black hover:underline cursor-pointer'
            onClick={() =>
              selectedstate === 'devices'
                ? setState('live')
                : setState('devices')
            }
          >
            Playing on {activeDevice?.browser}-
            {activeDevice?.socketId.slice(0, 5)}
          </span>
        </div>
      </footer>
    )
  );
};
