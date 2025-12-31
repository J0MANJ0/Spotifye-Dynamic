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
import { formatTime, skipBackward, skipForward } from '@/lib/utils';
import { useMusicStore } from '@/stores/use-music-store';
import { useEffect, useState } from 'react';

export const PlayControls = () => {
  const { user } = useUser();

  const {
    currentTrack,
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
  } = usePlayerStore();

  const [duration, setDuration] = useState(0);
  const [currentTimeApp, setCurrentTimeApp] = useState(0);
  const { currentAlbum } = useMusicStore();

  useEffect(() => {
    if (!audioRef) return;

    audioRef.currentTime = currentTimeApp;
  }, [audioRef, currentTimeApp]);

  useEffect(() => {
    const audio = audioRef;

    if (!audio) return;

    const updateTime = () => setCurrentTimeApp(audio.currentTime);
    const updateDuration = () => setDuration(audio?.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener('ended', handleEnded);
  }, [currentTrack, audioRef]);

  const handleSeek = (value: number[]) => {
    if (currentTrack) {
      if (audioRef) {
        audioRef.currentTime = value[0];
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
            disabled={!currentTrack}
            style={{
              opacity: !currentTrack ? 0.5 : 1,
              cursor: !currentTrack ? 'not-allowed' : 'pointer',
            }}
            onClick={toggleShuffle}
          >
            <Shuffle
              className={`${shuffle ? 'text-green-400' : 'text-white'}`}
            />
          </button>
        </Tooltip>

        <Tooltip placement='top' title={currentTrack ? 'Replay 10s' : ''}>
          <button
            onClick={() => skipBackward(audioRef, 10)}
            disabled={!currentTrack}
            className='hover:scale-[1.130] transition-all'
            style={{
              opacity: !currentTrack ? 0.5 : 1,
              cursor: !currentTrack ? 'not-allowed' : 'pointer',
            }}
          >
            <Replay10Icon fontSize='medium' sx={{ color: '#ccc' }} />
          </button>
        </Tooltip>

        <Tooltip
          placement='top'
          title={!currentTrack || currentIndex === 0 ? '' : 'Previous'}
        >
          <button
            className='hidden sm:inline-flex hover:text-white text-white hover:scale-[1.130] transition-all'
            onClick={playPrevious}
            disabled={!currentTrack || currentIndex === 0}
            style={{
              opacity: !currentTrack || currentIndex === 0 ? 0.5 : 1,
              cursor:
                !currentTrack || currentIndex === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            <SkipPreviousIcon fontSize='large' />
          </button>
        </Tooltip>

        <Tooltip
          placement='top'
          title={currentTrack && (isPlaying ? 'Pause' : 'Play')}
        >
          <button
            onClick={toggleSong}
            disabled={!currentTrack}
            className='hover:scale-[1.130] transition-all rounded-full'
            style={{
              opacity: !currentTrack ? 0.5 : 1,
              cursor: !currentTrack ? 'not-allowed' : 'pointer',
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
            !currentTrack || queue.length - 1 === currentIndex ? '' : 'Next'
          }
        >
          <button
            className='hidden sm:inline-flex hover:text-white text-white hover:scale-[1.130] transition-all'
            onClick={playNext}
            disabled={!currentTrack || queue.length - 1 === currentIndex}
            style={{
              opacity:
                !currentTrack || queue.length - 1 === currentIndex ? 0.5 : 1,
              cursor:
                !currentTrack || queue.length - 1 === currentIndex
                  ? 'not-allowed'
                  : 'pointer',
            }}
          >
            <SkipNextIcon fontSize='large' />
          </button>
        </Tooltip>

        <Tooltip placement='top' title={currentTrack ? 'Forward 10s' : ''}>
          <button
            onClick={() => skipForward(audioRef, 10)}
            disabled={!currentTrack}
            className='hover:scale-[1.130] transition-all'
            style={{
              opacity: !currentTrack ? 0.5 : 1,
              cursor: !currentTrack ? 'not-allowed' : 'pointer',
            }}
          >
            <Forward10Icon fontSize='medium' sx={{ color: '#ccc' }} />
          </button>
        </Tooltip>

        <RepeatMode />
      </div>
      <div className='hidden sm:flex items-center gap-2 w-full'>
        <div className='text-xs text-zinc-400'>
          {formatTime(currentTimeApp)}
        </div>
        <Slider
          value={[currentTimeApp]}
          max={duration || 100}
          step={1}
          disabled={!user}
          className={`w-full hover:cursor-grab active:cursor-grabbing ${
            user ? 'opacity-50' : 'opacity-100'
          }`}
          onValueChange={handleSeek}
        />
        <div className='text-xs text-zinc-400'>{formatTime(duration)}</div>
      </div>
    </div>
  );
};
