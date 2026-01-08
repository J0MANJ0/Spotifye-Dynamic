import { Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useMusicStore } from '@/stores/use-music-store';
import React from 'react';

type Props = {
  trackId: string;
};

export const ToggleLikeSong = ({ trackId }: Props) => {
  const { likedSongs, like, unLike } = useMusicStore();

  const isLiked = likedSongs.some(
    (track) => track?.trackId === Number(trackId)
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    isLiked ? unLike(Number(trackId)) : like(Number(trackId));
  };

  return (
    <Tooltip
      title={isLiked ? 'Remove from Liked Songs' : 'Add to Liked Songs'}
      placement='top'
    >
      <motion.button
        className='size-5 p-2 rounded-full text-black flex justify-center items-center cursor-pointer'
        onClick={(e) => handleClick(e)}
        initial={{ scale: 0.8, opacity: 0, y: -30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      >
        {!isLiked ? (
          <span className='group-hover:block hidden'>
            <AddCircleOutlineIcon fontSize='small' sx={{ color: '#ccc' }} />
          </span>
        ) : (
          <CheckCircleIcon fontSize='small' sx={{ color: '#ccff33' }} />
        )}
      </motion.button>
    </Tooltip>
  );
};
