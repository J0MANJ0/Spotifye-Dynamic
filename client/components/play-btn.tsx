'use client';

import { Track } from '@/types';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { usePlayerStore } from '@/stores/use-player-store';
import { useMusicStore } from '@/stores/use-music-store';

type Props = {
  track: Track;
};
export const PlayBtn = ({ track }: Props) => {
  const { currentTrackId, isPlaying, setcurrentTrackId, toggleSong } =
    usePlayerStore();

  const currentTrack = useMusicStore((s) => s.tracksByIds[currentTrackId!]);

  const iscurrentTrackId = currentTrack?.trackId === track.trackId;
  const handlePlay = () => {
    iscurrentTrackId ? toggleSong() : setcurrentTrackId(track?._id);
  };
  return (
    <button
      className={`absolute bottom-3 right-2 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all 
				opacity-0 translate-y-2 group-hover:translate-y-0 rounded-full p-2 size-12 ${
          iscurrentTrackId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      onClick={(e) => {
        e.stopPropagation();
        handlePlay();
      }}
    >
      {iscurrentTrackId && isPlaying ? (
        <PauseIcon fontSize='medium' sx={{ color: '#000' }} />
      ) : (
        <PlayArrowIcon fontSize='medium' sx={{ color: '#000' }} />
      )}
    </button>
  );
};
