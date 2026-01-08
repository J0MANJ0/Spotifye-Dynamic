'use client';

import { useMusicStore } from '@/stores/use-music-store';
import { UsersActivities } from './users-activities';
import { Queue } from './queue';
import { DevicePicker } from './device-picker';
import { LiveTrack } from './live-track';

export const RightSidebar = () => {
  const { selectedstate } = useMusicStore();
  return (
    <div className='h-full w-full bg-zinc-900 rounded-md'>
      {selectedstate === 'users' && <UsersActivities />}
      {selectedstate === 'queue' && <Queue />}
      {selectedstate === 'devices' && <DevicePicker />}
      {selectedstate === 'live' && <LiveTrack />}
    </div>
  );
};
