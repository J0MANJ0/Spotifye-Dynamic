import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

type Props = {};
export const PlayBtnFollow = () => {
  const iscurrentTrack = false;
  return (
    <button
      className={`absolute bottom-3 right-2 sm:bottom-0 sm:right-1 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all 
				opacity-0 translate-y-2 group-hover:translate-y-0 rounded-full p-2 size-10 ${
          iscurrentTrack ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      //   onClick={(e) => {
      //     e.stopPropagation();
      //     handlePlay();
      //   }}
    >
      {iscurrentTrack ? (
        <PauseIcon fontSize='medium' sx={{ color: '#000' }} />
      ) : (
        <PlayArrowIcon fontSize='medium' sx={{ color: '#000' }} />
      )}
    </button>
  );
};
