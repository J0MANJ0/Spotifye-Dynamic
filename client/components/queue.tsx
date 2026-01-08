'use client';

import { useNavigationHistory } from '@/hooks/use-nav';
import { usePlayerStore } from '@/stores/use-player-store';
import { Track } from '@/types';
import { useUser } from '@clerk/nextjs';
import { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { Tooltip } from '@mui/material';
import { ToggleLikeSong } from './toggle-like';
import { ScrollArea } from './ui/scroll-area';
import { useMusicStore } from '@/stores/use-music-store';

export const Queue = () => {
  const { user } = useUser();
  const {
    queue,
    currentTrackId,
    progress,
    toastShown,
    currentIndex,
    likedAlbumPlaying,
    madeForYouAlbumPlaying,
    artistAlbumPlaying,
    isPlaying,
    playAlbum,
    toggleSong,
    repeatMode,
    setToastShown,
  } = usePlayerStore();
  const { router } = useNavigationHistory();
  const { tracksByIds, currentAlbumId } = useMusicStore();

  const currentTrack = tracksByIds[currentTrackId!];
  const queuedTracks = useMemo(() => {
    return queue.map((id) => tracksByIds[id]).filter(Boolean);
  }, [queue]);

  const handlePlaySong = (track: Track) => {
    if (!queue) return;
    const trackIdx = queue.findIndex((s) => s === track._id);

    if (trackIdx === -1) return;
    playAlbum(
      queue,
      currentAlbumId
        ? 'album'
        : likedAlbumPlaying
        ? 'likedSongsAlbum'
        : madeForYouAlbumPlaying
        ? 'madeForYouAlbum'
        : 'artistAlbum',
      currentAlbumId,
      trackIdx
    );
    usePlayerStore.setState({ toastShown: false });
  };

  useEffect(() => {
    if (
      progress.toFixed(0).toString() === '90' &&
      !toastShown &&
      currentIndex !== queuedTracks.length - 1 &&
      repeatMode !== 'one'
    ) {
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-custom-enter' : 'animate-custom-leave'
            } max-w-md w-full bg-zinc-700 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className='flex border-r border-gray-800'>
              <span className='w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-white hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500'>
                Coming next
              </span>
            </div>
            <div className='flex-1 w-0 p-4'>
              <div className='flex items-start'>
                <div className='shrink-0 pt-0.5'>
                  <img
                    className='size-12 rounded-full'
                    src={queuedTracks[currentIndex + 1].data.album.cover_medium}
                    alt=''
                  />
                </div>
                <div className='ml-3 flex-1'>
                  <p className='text-sm font-medium text-white'>
                    {queuedTracks[currentIndex + 1].data.title}
                  </p>
                  <p className='mt-1 text-sm text-gray-300'>
                    {queuedTracks[currentIndex + 1].data.artist.name}
                  </p>
                </div>
                <div className='flex justify-center items-center animate-pulse transition-all'>
                  <span className='text-md'>🎧</span>
                </div>
              </div>
            </div>
            <div className='flex border-l border-gray-800'>
              <button
                onClick={() => {
                  handlePlaySong(queuedTracks[currentIndex + 1]);
                  toast.dismiss(t.id);
                }}
                className='w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-green-600 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500'
              >
                <PlayArrowIcon fontSize='medium' sx={{ color: '#fff' }} />
              </button>
            </div>
          </div>
        ),
        { duration: 3000, position: 'bottom-right' }
      );

      setToastShown(true);
    }
  }, [progress, toastShown, currentIndex, setToastShown]);

  return (
    <div className='h-full bg-zinc-900 rounded-lg flex flex-col p-2'>
      {currentTrack ? (
        <>
          <div className='flex justify-between my-2'>
            <h3 className='text-md font-semibold text-gray-300'>Now Playing</h3>

            <Tooltip
              placement='left'
              title={
                likedAlbumPlaying
                  ? 'Liked Songs'
                  : madeForYouAlbumPlaying
                  ? 'For You'
                  : artistAlbumPlaying
                  ? `By ${currentTrack?.data?.artist?.name}`
                  : currentTrack.data.album.title
              }
            >
              {currentTrack && (
                <img
                  src={
                    likedAlbumPlaying
                      ? '/liked-songs.jpeg'
                      : madeForYouAlbumPlaying
                      ? user?.imageUrl
                      : artistAlbumPlaying
                      ? currentTrack?.data?.artist?.picture_xl
                      : currentTrack.data.album.cover_medium
                  }
                  alt={
                    likedAlbumPlaying
                      ? 'liked-songs'
                      : madeForYouAlbumPlaying
                      ? 'For you'
                      : artistAlbumPlaying
                      ? `${currentTrack?.data?.artist?.name}`
                      : currentTrack.data.album.title
                  }
                  className='object-cover size-[38px] rounded-md hover:scale-[1.030] transition-all cursor-pointer'
                  onClick={() => {
                    router.push(
                      likedAlbumPlaying
                        ? '/liked-songs'
                        : madeForYouAlbumPlaying
                        ? '/for-you'
                        : artistAlbumPlaying
                        ? `/artists/${currentTrack?.data?.artist?.id}`
                        : `/albums/${currentTrack.data.album.id}`
                    );
                  }}
                />
              )}
            </Tooltip>
          </div>

          <div
            className='flex items-center ml-1 p-[7px] gap-2 hover:bg-zinc-800 hover:rounded-md cursor-pointer relative group'
            onClick={toggleSong}
          >
            <div className='hidden group-hover:block absolute left-5 top-5'>
              {isPlaying ? (
                <PauseIcon fontSize='medium' sx={{ color: '#fff' }} />
              ) : (
                <PlayArrowIcon fontSize='medium' sx={{ color: '#fff' }} />
              )}
            </div>
            <img
              src={currentTrack?.data.album.cover_medium}
              alt=''
              className='size-12 rounded-md shrink-0 object-cover'
            />
            <div className='flex flex-col gap-2 p-2'>
              <span className='font-bold text-sm text-green-400'>
                {currentTrack?.data.title}
              </span>
              <span className='text-xs text-zinc-400'>
                {currentTrack?.data.artist.name}
              </span>
            </div>
            {user && (
              <div className='flex justify-center items-center absolute right-5'>
                <ToggleLikeSong trackId={String(currentTrack.trackId)} />
              </div>
            )}
          </div>
          <ScrollArea>
            <div>
              {currentIndex !== queuedTracks.length - 1 && (
                <h3 className='text-md font-semibold text-gray-300'>
                  Next from:{' '}
                  <span
                    className='text-white hover:text-green-400 font-bold text-md hover:underline hover:cursor-pointer'
                    onClick={() =>
                      router.push(
                        likedAlbumPlaying
                          ? '/liked-songs'
                          : madeForYouAlbumPlaying
                          ? '/for-you'
                          : artistAlbumPlaying
                          ? `/artists/${currentTrack?.data?.artist?.id}`
                          : `/albums/${currentTrack.data.album.id}`
                      )
                    }
                  >
                    {likedAlbumPlaying
                      ? 'Liked Songs'
                      : madeForYouAlbumPlaying
                      ? 'For You'
                      : artistAlbumPlaying
                      ? `${currentTrack?.data?.artist?.name}`
                      : currentTrack?.data.album.title}
                  </span>
                </h3>
              )}
              <ul className='gap-2 flex flex-col'>
                {queuedTracks.length !== 0 ? (
                  queuedTracks
                    .filter(
                      (s, i) => s._id !== currentTrackId && currentIndex < i
                    )
                    .map((song) => {
                      const iscurrentTrackId = currentTrackId === song._id;
                      return (
                        <li
                          key={song._id}
                          className='flex items-center p-2 gap-2 hover:bg-zinc-800 hover:rounded-md relative group'
                        >
                          <div
                            className='hidden group-hover:block absolute left-5 top-5 cursor-pointer'
                            onClick={() => {
                              if (iscurrentTrackId) {
                                toggleSong();
                              } else {
                                handlePlaySong(song);
                              }
                            }}
                          >
                            {isPlaying && currentTrack?._id === song._id ? (
                              <PauseIcon
                                fontSize='medium'
                                sx={{ color: '#fff' }}
                              />
                            ) : (
                              <PlayArrowIcon
                                fontSize='medium'
                                sx={{ color: '#fff' }}
                              />
                            )}
                          </div>
                          <img
                            src={song.data.album.cover_medium}
                            alt={song.data.title}
                            className='size-12 rounded-md shrink-0 object-cover'
                          />
                          <div className='flex flex-col gap-2'>
                            <span className='text-sm font-bold text-gray-200'>
                              {song.data.title}
                            </span>
                            <span className='text-xs font-medium text-zinc-400'>
                              {song.data.contributors.map((c, i) => (
                                <span key={c.id}>
                                  {c.name}
                                  {i !== song?.data?.contributors?.length - 1 &&
                                    ','}
                                </span>
                              ))}
                            </span>
                          </div>
                          {user && (
                            <div className='absolute right-5'>
                              <ToggleLikeSong trackId={String(song.trackId)} />
                            </div>
                          )}
                        </li>
                      );
                    })
                ) : (
                  <p>No tracks</p>
                )}
              </ul>
            </div>
          </ScrollArea>
        </>
      ) : (
        <>
          <div className='flex justify-center items-center py-5'>
            <div className='flex justify-center items-center gap-4 flex-col'>
              <img
                src='/spotify.png'
                alt='logo'
                className='object-cover size-9 animate-bounce transition-all'
              />
              <h3 className='text-md font-bold text-gray-300'>No Queue</h3>
            </div>
          </div>
          <hr className='w-full bg-zinc-500' />
        </>
      )}
    </div>
  );
};
