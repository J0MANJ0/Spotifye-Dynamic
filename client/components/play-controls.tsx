'use client';

import { RepeatMode } from './repeat-mode';
import { Slider } from './ui/slider';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import Forward10Icon from '@mui/icons-material/Forward10';
import Replay10Icon from '@mui/icons-material/Replay10';
import { Tooltip } from '@mui/material';
import { Shuffle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { usePlayerStore } from '@/stores/use-player-store';
import { cn, formatTime, skipBackward, skipForward } from '@/lib/utils';
import { useMusicStore } from '@/stores/use-music-store';
import { useEffect, useState } from 'react';
import { useSocketStore } from '@/stores/use-socket-store';

export const PlayControls = () => {
  const { user } = useUser();

  const {
    currentTrackId,
    currentTime,
    shuffle,
    currentIndex,
    isPlaying,
    queue,
    likedAlbumPlaying,
    playNext,
    playPrevious,
    toggleSong,
    toggleShuffle,
    audioRef,
    requestSeek,
  } = usePlayerStore();

  const [duration, setDuration] = useState(0);
  const { currentAlbumId, tracksByIds, albumsByIds } = useMusicStore();

  const currentTrack = tracksByIds[currentTrackId!];
  const currentAlbum = albumsByIds[currentAlbumId!];

  useEffect(() => {
    const audio = audioRef;

    if (!audio || !currentTrackId) return;

    const updateDuration = () => setDuration(audio?.duration);

    audio.addEventListener('loadedmetadata', updateDuration);

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener('ended', handleEnded);
  }, [audioRef, currentTrackId]);

  const handleSeek = (value: number[]) => {
    if (currentTrackId) {
      if (audioRef) {
        audioRef.currentTime = value[0];
        requestSeek(value[0]);
      }
    }
  };

  return (
    <div className='flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]'>
      <div className='flex items-center gap-4 sm:gap-6'>
        <Tooltip
          placement='top'
          title={
            shuffle
              ? `Disabled shuffle for ${
                  currentTrack?.data.album.title !== currentAlbum?.data.title &&
                  likedAlbumPlaying
                    ? 'Liked Songs'
                    : `${
                        isPlaying && !likedAlbumPlaying
                          ? currentTrack?.data.album.title
                          : 'Liked Songs'
                      }`
                }`
              : `Enable shuffle for ${
                  currentTrack?.data.album.title !== currentAlbum?.data.title &&
                  likedAlbumPlaying
                    ? 'Liked Songs'
                    : `${
                        isPlaying && !likedAlbumPlaying
                          ? currentTrack?.data.album.title
                          : 'Liked Songs'
                      }`
                }`
          }
        >
          <button
            className='hover:scale-[1.130] transition-all'
            disabled={!currentTrackId}
            style={{
              opacity: !currentTrackId ? 0.5 : 1,
              cursor: !currentTrackId ? 'not-allowed' : 'pointer',
            }}
            onClick={toggleShuffle}
          >
            <Shuffle
              className={`${shuffle ? 'text-green-400' : 'text-white'}`}
            />
          </button>
        </Tooltip>

        <Tooltip placement='top' title={currentTrackId ? 'Replay 10s' : ''}>
          <button
            onClick={() => skipBackward()}
            disabled={!currentTrackId}
            className='hover:scale-[1.130] transition-all'
            style={{
              opacity: !currentTrackId ? 0.5 : 1,
              cursor: !currentTrackId ? 'not-allowed' : 'pointer',
            }}
          >
            <Replay10Icon fontSize='medium' sx={{ color: '#ccc' }} />
          </button>
        </Tooltip>

        <Tooltip
          placement='top'
          title={!currentTrackId || currentIndex === 0 ? '' : 'Previous'}
        >
          <button
            className='hidden sm:inline-flex hover:text-white text-white hover:scale-[1.130] transition-all'
            onClick={playPrevious}
            disabled={!currentTrackId || currentIndex === 0}
            style={{
              opacity: !currentTrackId || currentIndex === 0 ? 0.5 : 1,
              cursor:
                !currentTrackId || currentIndex === 0
                  ? 'not-allowed'
                  : 'pointer',
            }}
          >
            <SkipPreviousIcon fontSize='large' />
          </button>
        </Tooltip>

        <Tooltip
          placement='top'
          title={currentTrackId && (isPlaying ? 'Pause' : 'Play')}
        >
          <button
            onClick={toggleSong}
            disabled={!currentTrackId}
            className='hover:scale-[1.130] transition-all rounded-full'
            style={{
              opacity: !currentTrackId ? 0.5 : 1,
              cursor: !currentTrackId ? 'not-allowed' : 'pointer',
            }}
          >
            {isPlaying ? (
              <PauseCircleFilledIcon fontSize='large' />
            ) : (
              <PlayCircleIcon fontSize='large' />
            )}
          </button>
        </Tooltip>

        <Tooltip
          placement='top'
          title={
            !currentTrackId || queue.length - 1 === currentIndex ? '' : 'Next'
          }
        >
          <button
            className='hidden sm:inline-flex hover:text-white text-white hover:scale-[1.130] transition-all'
            onClick={playNext}
            disabled={!currentTrackId || queue.length - 1 === currentIndex}
            style={{
              opacity:
                !currentTrackId || queue.length - 1 === currentIndex ? 0.5 : 1,
              cursor:
                !currentTrackId || queue.length - 1 === currentIndex
                  ? 'not-allowed'
                  : 'pointer',
            }}
          >
            <SkipNextIcon fontSize='large' />
          </button>
        </Tooltip>

        <Tooltip placement='top' title={currentTrackId ? 'Forward 10s' : ''}>
          <button
            onClick={() => skipForward()}
            disabled={!currentTrackId}
            className='hover:scale-[1.130] transition-all'
            style={{
              opacity: !currentTrackId ? 0.5 : 1,
              cursor: !currentTrackId ? 'not-allowed' : 'pointer',
            }}
          >
            <Forward10Icon fontSize='medium' sx={{ color: '#ccc' }} />
          </button>
        </Tooltip>

        <RepeatMode />
      </div>
      <div className='hidden sm:flex items-center gap-2 w-full'>
        <div className='text-xs text-zinc-400'>{formatTime(currentTime!)}</div>
        <Slider
          value={[currentTime!]}
          max={duration || 100}
          step={1}
          disabled={!user}
          className={cn(
            'w-full hover:cursor-pointer active:cursor-pointer',
            user ? 'opacity-100' : 'opacity-50'
          )}
          onValueChange={handleSeek}
        />
        <div className='text-xs text-zinc-400'>{formatTime(duration)}</div>
      </div>
    </div>
  );
};
