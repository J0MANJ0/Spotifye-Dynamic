'use client';

import {
  AudioLines,
  ListMusic,
  Mic2,
  SidebarClose,
  SidebarOpen,
  Users,
  Volume1,
  Volume2,
  VolumeOff,
} from 'lucide-react';
import { Tooltip } from '@mui/material';
import DownloadSharpIcon from '@mui/icons-material/DownloadSharp';
import { Slider } from './ui/slider';
import { useEffect, useState } from 'react';
import { useNavigationHistory } from '@/hooks/use-nav';
import { useUser } from '@clerk/nextjs';
import { useMusicStore } from '@/stores/use-music-store';
import { usePlayerStore } from '@/stores/use-player-store';
import { cn, downloadSong } from '@/lib/utils';

export const PlayInteracts = () => {
  const { user } = useUser();
  const { setState, selectedstate } = useMusicStore();
  const { currentTrack, isMaxRight, audioRef } = usePlayerStore();
  const [volume, setVolume] = useState(65);
  const { router, pathname } = useNavigationHistory();

  useEffect(() => {
    if (audioRef) {
      audioRef.volume = volume / 100;
    }
  }, [volume, audioRef]);

  return (
    <div className='sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end'>
      {currentTrack && !user && (
        <Tooltip
          placement='top'
          title={`Download ${currentTrack.data.title} by ${currentTrack.data.artist.name}`}
        >
          <button onClick={downloadSong}>
            <DownloadSharpIcon fontSize='small' sx={{ color: '#fff' }} />
          </button>
        </Tooltip>
      )}

      {currentTrack && isMaxRight && (
        <Tooltip placement='top' title='Now Playing View'>
          <button
            className='hover:text-white text-zinc-400 hover:bg-zinc-800 hover:rounded-md p-2.5 cursor-pointer'
            onClick={() => setState('live')}
          >
            <AudioLines
              className={`size-4 ${
                currentTrack && selectedstate === 'live' && 'text-green-400'
              }`}
            />
          </button>
        </Tooltip>
      )}

      <Tooltip placement='top' title='Lyrics'>
        <button
          className='hover:text-white text-zinc-400 hover:bg-zinc-800 hover:rounded-md p-2.5 cursor-pointer'
          onClick={() => router.push('/lyrics')}
        >
          <Mic2
            className={`size-4 ${
              currentTrack && pathname === '/lyrics'
                ? 'text-green-400'
                : 'text-muted-foreground'
            }`}
          />
        </button>
      </Tooltip>

      {isMaxRight && (
        <Tooltip placement='top' title='Queue'>
          <button
            className='hover:text-white text-zinc-400 hover:bg-zinc-800 hover:rounded-md p-2.5'
            onClick={() => setState('queue')}
          >
            <ListMusic
              className={`size-4 ${
                currentTrack && selectedstate === 'queue' && 'text-green-400'
              }`}
            />
          </button>
        </Tooltip>
      )}

      {isMaxRight && (
        <Tooltip placement='top' title='Users'>
          <button
            className='hover:text-white text-zinc-400 hover:bg-zinc-800 hover:rounded-md p-2.5'
            onClick={() => setState('users')}
          >
            <Users
              className={`size-4 ${
                currentTrack && selectedstate === 'users' && 'text-green-400'
              }`}
            />
          </button>
        </Tooltip>
      )}

      {/* {user && <DevicePicker />} */}

      <Tooltip
        placement='top'
        title={isMaxRight ? 'Close Sidebar' : 'Open Sidebar'}
      >
        <button
          className={cn(
            'cursor-pointer',
            isMaxRight ? 'opacity-100' : 'opacity-50'
          )}
          onClick={() =>
            usePlayerStore.setState((state) => ({
              isMaxRight: !state.isMaxRight,
            }))
          }
        >
          {isMaxRight ? (
            <SidebarOpen className='h-4 w-4 text-green-400' />
          ) : (
            <SidebarClose className='h-4 w-4' />
          )}
        </button>
      </Tooltip>

      <div className='flex items-center gap-2 cursor-pointer hover:text-green-400'>
        {volume === 0 ? (
          <VolumeOff className='size-4' onClick={() => setVolume(55)} />
        ) : (
          <span onClick={() => setVolume(0)}>
            {volume <= 50 ? (
              <Volume1 className='size-4' />
            ) : (
              <Volume2 className='size-4' />
            )}
          </span>
        )}

        <Slider
          value={[volume]}
          max={100}
          step={1}
          className='w-24 hover:cursor-grab active:cursor-grabbing'
          onValueChange={(value) => {
            setVolume(value[0]);
            if (audioRef) {
              audioRef.volume = value[0] / 100;
            }
          }}
        />
      </div>
    </div>
  );
};
