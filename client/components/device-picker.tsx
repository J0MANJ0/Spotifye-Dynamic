'use client';

import ComputerIcon from '@mui/icons-material/Computer';
import TabletIcon from '@mui/icons-material/Tablet';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

import { usePlayerStore } from '@/stores/use-player-store';
import { useMemo } from 'react';
import { X } from 'lucide-react';
import { useSocketStore } from '@/stores/use-socket-store';
import { NoDevicesFound } from './no-devices';
import { useMusicStore } from '@/stores/use-music-store';

export const DevicePicker = () => {
  const { devices: list, isActive, setActiveDevice } = usePlayerStore();
  const { socket } = useSocketStore();
  const setState = useMusicStore((s) => s.setState);

  const devices = useMemo(() => {
    return list;
  }, [list, isActive, setActiveDevice]);

  const activeDevice = useMemo(() => {
    return list.find((d) => d.isActive);
  }, [list]);

  if (!activeDevice || !socket) return <NoDevicesFound />;

  return (
    <div className='h-full rounded-md bg-zinc-900 p-4'>
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between items-center'>
          <h2 className='font-semibold text-md'>Connect</h2>

          <div
            onClick={() => setState('live')}
            className='p-2 rounded-full h-8 w-8 hover:bg-zinc-800 flex justify-center items-center cursor-pointer'
          >
            <X className='h-4 w-4' />
          </div>
        </div>
        <div className='bg-zinc-800 p-4 rounded-md'>
          <div className='flex gap-4'>
            <div>
              {activeDevice.deviceType === 'mobile' ? (
                <PhoneIphoneIcon className='text-green-500' />
              ) : activeDevice.deviceType === 'desktop' ? (
                <ComputerIcon className='text-green-500' />
              ) : (
                <TabletIcon className='text-green-500' />
              )}
            </div>
            <div>
              <span className='text-green-500'>
                {activeDevice.socketId === socket?.id
                  ? `This ${
                      activeDevice.deviceType === 'desktop'
                        ? 'computer'
                        : activeDevice.deviceType
                    }`
                  : activeDevice.browser &&
                    `${activeDevice.browser}-${activeDevice.socketId.slice(
                      0,
                      5
                    )}`}
              </span>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          {devices.length > 1 ? (
            devices.map((dev) => {
              return (
                dev.socketId !== activeDevice.socketId && (
                  <div
                    className='hover:bg-zinc-800 p-3 rounded-md cursor-pointer'
                    key={dev.socketId}
                    onClick={() => setActiveDevice(dev.socketId)}
                  >
                    <div className='flex gap-4'>
                      <div>
                        {dev.deviceType === 'mobile' ? (
                          <PhoneIphoneIcon />
                        ) : dev.deviceType === 'desktop' ? (
                          <ComputerIcon />
                        ) : (
                          <TabletIcon />
                        )}
                      </div>
                      <div>
                        <span>
                          {dev.socketId === socket?.id
                            ? `This ${
                                dev.deviceType === 'desktop'
                                  ? 'computer'
                                  : dev.deviceType
                              }`
                            : dev.browser &&
                              `${dev.browser}-${dev.socketId.slice(0, 5)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              );
            })
          ) : (
            <NoDevicesFound />
          )}
        </div>
      </div>
    </div>
  );
};
