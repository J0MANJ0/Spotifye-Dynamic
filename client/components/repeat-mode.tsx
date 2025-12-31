'use client';

import { Tooltip } from '@mui/material';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import LoopIcon from '@mui/icons-material/Loop';
import { usePlayerStore } from '@/stores/use-player-store';

export const RepeatMode = () => {
  const { currentTrack, repeatMode, togglRepeatMode } = usePlayerStore();
  return (
    <Tooltip
      placement='top'
      title={
        currentTrack
          ? repeatMode === 'all'
            ? 'Enable repeat one'
            : repeatMode === 'one'
            ? 'Disable repeat'
            : 'Enable repeat'
          : ''
      }
    >
      <button
        onClick={togglRepeatMode}
        style={{
          opacity: !currentTrack ? 0.5 : 1,
          cursor: !currentTrack ? 'not-allowed' : 'pointer',
        }}
        className='hover:scale-[1.130] transition-all'
      >
        {repeatMode === 'off' && (
          <RepeatIcon
            color='disabled'
            fontSize='medium'
            sx={{ color: '#ccc' }}
          />
        )}
        {repeatMode === 'one' && (
          <RepeatOneIcon fontSize='medium' sx={{ color: '#4ade80' }} />
        )}
        {repeatMode === 'all' && (
          <LoopIcon fontSize='medium' sx={{ color: '#4ade80' }} />
        )}
      </button>
    </Tooltip>
  );
};
