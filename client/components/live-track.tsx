'use client';

import { useNavigationHistory } from '@/hooks/use-nav';
import { useAuthStore } from '@/stores/use-auth-store';
import { useMusicStore } from '@/stores/use-music-store';
import { usePlayerStore } from '@/stores/use-player-store';
import type { Album, Track } from '@/types';
import { useEffect, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { ToggleLikeSong } from './toggle-like';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { ArtistCard } from './artist-card';
import { CreditsCard } from './credits-card';

export const LiveTrack = () => {
  const { user } = useAuthStore();
  const { router } = useNavigationHistory();
  const {
    currentTrack,
    toggleSong,
    queue,
    playAlbum,
    isPlaying,
    currentIndex,
    setcurrentTrack,
    likedAlbumPlaying,
    progress,
    toastShown,
    setToastShown,
    repeatMode,
  } = usePlayerStore();
  const { albums, tracks, setState, currentAlbum } = useMusicStore();

  const scrollToCurrent = useRef<HTMLImageElement | null>(null);

  if (!currentTrack) {
    return (
      <div className='size-full bg-zinc-900 rounded-md flex flex-col p-4 gap-5'>
        <div className='flex justify-center items-center gap-4 flex-col'>
          <img
            src='/spotify.png'
            alt='logo'
            className='object-cover size-9 animate-bounce transition-all'
          />
          <h3 className='text-md font-bold text-gray-300'>No Track Yet!</h3>
        </div>
        <hr className='w-full bg-zinc-500' />
      </div>
    );
  }

  useEffect(() => {
    if (
      progress.toFixed(0).toString() === '90' &&
      !toastShown &&
      currentIndex !== queue.length - 1 &&
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
                    src={queue[currentIndex + 1].data.album.cover_medium}
                    alt=''
                  />
                </div>
                <div className='ml-3 flex-1'>
                  <p className='text-sm font-medium text-white'>
                    {queue[currentIndex + 1].data.title}
                  </p>
                  <p className='mt-1 text-sm text-gray-300'>
                    {queue[currentIndex + 1].data.artist.name}
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
                  handlePlaySong(queue[currentIndex + 1]);
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
  }, [progress, toastShown, setToastShown]);

  useEffect(() => {
    if (currentTrack) {
      scrollToCurrent.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTrack?.trackId]);

  const associatedSongs = useMemo(() => {
    const filtered = albums
      .filter((a) => a?.data?.id === currentTrack?.data?.album?.id)[0]
      ?.tracks.filter((s) => s?.trackId !== currentTrack?.trackId);
    return filtered?.sort(() => Math.random() - 0.5).slice(0, 4);
  }, [currentTrack?.data?.album?.id]);

  const moreByArtist = useMemo(() => {
    const filtered = tracks.filter(
      (t) => t.data.artist.id === currentTrack.data.artist.id
    );
    return filtered.sort(() => Math.random() - 0.5).slice(0, 5);
  }, [currentTrack?.data?.artist?.id]);

  const relatedAlbums = useMemo(() => {
    const filtered = albums.filter(
      (a) =>
        a.data.id !== currentTrack?.data?.album.id &&
        a.data.artist.id === currentTrack?.data.artist.id
    );

    return filtered.sort(() => Math.random() - 0.5).slice(0, 4);
  }, [currentTrack.trackId, currentAlbum?.albumId]);

  const handlePlayAlbum = (album: Album) => {
    if (!album) return;
    const isCurrentAlbumPlaying = album?.tracks.some(
      (track) => track._id === currentTrack?._id
    );

    if (isCurrentAlbumPlaying && !likedAlbumPlaying) {
      toggleSong();
    } else {
      playAlbum(album.tracks);
      usePlayerStore.setState({ likedAlbumPlaying: false });
      router.push(`/albums/${album.data.id}`);
    }
  };

  const handlePlaySong = (track: Track) => {
    if (!queue) return;
    const songIdx = queue.findIndex((s) => s._id === track._id);

    if (songIdx === -1) return;
    playAlbum(queue, songIdx);
    usePlayerStore.setState({ toastShown: false });
  };

  const handlePlay = (track: Track) => {
    if (!track) return;
    const iscurrentTrack = currentTrack?._id === track._id;
    iscurrentTrack ? toggleSong() : setcurrentTrack(track);
  };

  return (
    <div className='h-full w-full bg-zinc-900 rounded-md flex flex-col p-4 gap-5'>
      <div
        className='font-bold text-white text-xl hover:underline cursor-pointer'
        onClick={() => router.push(`/albums/${currentTrack.data.album.id}`)}
      >
        <h3>{currentTrack?.data.album.title}</h3>
      </div>
      <ScrollArea className='flex flex-col space-y-3'>
        <div className='w-full'>
          <div className='w-full'>
            <img
              src={currentTrack?.data.album.cover_xl}
              alt={currentTrack?.data.title}
              className='w-full object-contain rounded-md brightness-75 hover:brightness-100 transition-all duration-300'
              ref={currentTrack && scrollToCurrent}
            />
          </div>
        </div>

        <div className='flex justify-between items-center p-2 group mt-4'>
          <div className='flex flex-col'>
            <h2
              className='text-2xl font-extrabold text-gray-200 hover:underline cursor-pointer'
              onClick={() =>
                router.push(`/albums/${currentTrack.data.album.id}`)
              }
            >
              {currentTrack?.data.title}
            </h2>
            <p className='text-zinc-400 text-sm  cursor-pointer'>
              {currentTrack.data.contributors.map((c, i) => (
                <span
                  key={c.id}
                  className='hover:underline cursor-pointer'
                  onClick={() => router.push(`/artists/${c.id}`)}
                >
                  {c.name}
                  {i !== currentTrack.data.contributors.length - 1 && ','}
                </span>
              ))}
            </p>
          </div>
          {user && (
            <div>
              <ToggleLikeSong trackId={String(currentTrack?.trackId)} />
            </div>
          )}
        </div>

        <div className='mt-4 w-full'>
          <ArtistCard />
        </div>
        <div className='mt-4 w-full'>
          <CreditsCard />
        </div>
        {associatedSongs?.length > 0 && (
          <div className='p-2 bg-zinc-800 rounded-md mt-4'>
            <div className='flex justify-between items-center p-2'>
              <h3 className='font-semibold'>
                More from {currentTrack.data.album.title}
              </h3>
              <span
                className='text-zinc-400 text-xs hover:underline cursor-pointer'
                onClick={() =>
                  router.push(`/albums/${currentTrack.data.album.id}`)
                }
              >
                Show all
              </span>
            </div>
            <ul className='gap-2 flex flex-col'>
              {associatedSongs?.map((song) => {
                const iscurrentTrack = currentTrack?._id === song._id;
                return (
                  <li
                    key={song._id}
                    className='flex items-center p-2 gap-2 hover:bg-zinc-700 hover:rounded-md relative group'
                  >
                    <div
                      className='hidden group-hover:block absolute left-5 top-5 cursor-pointer'
                      onClick={() => {
                        if (iscurrentTrack) {
                          toggleSong();
                        } else {
                          handlePlaySong(song);
                        }
                      }}
                    >
                      {isPlaying && currentTrack?._id === song._id ? (
                        <PauseIcon fontSize='medium' sx={{ color: '#fff' }} />
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
                      <span
                        className='text-sm font-bold text-gray-200 hover:underline cursor-pointer'
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/albums/${song.data.album.id}`);
                        }}
                      >
                        {song.data.title}
                      </span>
                      <span className='text-xs font-medium text-zinc-400'>
                        {song.data.artist.name}
                      </span>
                    </div>
                    {user && (
                      <div className='absolute right-5'>
                        <ToggleLikeSong trackId={String(song.trackId)} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {moreByArtist?.length > 0 && (
          <div className='p-2 bg-zinc-800 rounded-md mt-4'>
            <div className='flex items-center p-2 text-gray-300'>
              <h3 className='font-semibold'>
                From {currentTrack.data.artist.name}
              </h3>
            </div>
            <ul className='gap-2 flex flex-col'>
              {moreByArtist.map((song) => (
                <li
                  key={song._id}
                  className='flex items-center p-2 gap-2 hover:bg-zinc-700 hover:rounded-md relative group cursor-pointer'
                  onClick={() => handlePlay(song)}
                >
                  <div className='hidden group-hover:block absolute left-5 top-5'>
                    {isPlaying && currentTrack?._id === song._id ? (
                      <PauseIcon fontSize='medium' sx={{ color: '#fff' }} />
                    ) : (
                      <PlayArrowIcon fontSize='medium' sx={{ color: '#fff' }} />
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
                    <span
                      className='text-xs font-medium text-zinc-400 hover:underline cursor-pointer'
                      onClick={() =>
                        router.push(`/albums/${song.data.album.id}`)
                      }
                    >
                      {song.data.album.title}
                    </span>
                  </div>
                  {user && (
                    <div className='absolute right-5'>
                      <ToggleLikeSong trackId={String(song.trackId)} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {relatedAlbums?.length > 0 && (
          <div className='p-2 bg-zinc-800 rounded-md mt-4'>
            <div className='flex  items-center p-2 text-gray-300'>
              <h3 className='font-semibold'>
                Related Albums to {currentTrack.data.artist.name}
              </h3>
            </div>
            <ul className='gap-2 flex flex-col'>
              {relatedAlbums.map((album) => (
                <li
                  key={album._id}
                  className='flex items-center p-2 gap-2 hover:bg-zinc-700 hover:rounded-md relative group'
                >
                  <div
                    className='hidden group-hover:block absolute left-5 top-5 cursor-pointer'
                    onClick={() => handlePlayAlbum(album)}
                  >
                    <PlayArrowIcon fontSize='medium' sx={{ color: '#fff' }} />
                  </div>
                  <img
                    src={album.data.cover_medium}
                    alt={album.data.title}
                    className='size-12 rounded-md shrink-0 object-cover'
                  />
                  <div className='flex flex-col gap-2'>
                    <span
                      className='text-sm font-bold text-gray-200 hover:underline cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/albums/${album.data.id}`);
                      }}
                    >
                      {album.data.title}
                    </span>
                    <span className='text-xs font-medium text-zinc-400 hover:underline cursor-pointer'>
                      Album • {album.data.artist.name}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {currentIndex !== queue.length - 1 && (
          <div className='p-2 rounded-md bg-zinc-800 mt-4'>
            <div className='flex justify-between items-center p-2'>
              <h3 className='font-bold text-sm'>Next in Queue</h3>
              <span
                className='text-zinc-400 text-xs hover:underline cursor-pointer'
                onClick={() => setState('queue')}
              >
                Open Queue
              </span>
            </div>
            <div
              className='flex items-center ml-1 p-[7px] gap-2 hover:bg-zinc-700 hover:rounded-md cursor-pointer relative group'
              onClick={() => handlePlaySong(queue[currentIndex + 1])}
            >
              <div className='hidden group-hover:block absolute left-5 top-5'>
                {isPlaying &&
                queue[currentIndex + 1]._id === currentTrack._id ? (
                  <PauseIcon fontSize='medium' sx={{ color: '#fff' }} />
                ) : (
                  <PlayArrowIcon fontSize='medium' sx={{ color: '#fff' }} />
                )}
              </div>
              <img
                src={queue[currentIndex + 1].data.album.cover_medium}
                alt=''
                className='size-12 rounded-md shrink-0 object-cover'
              />
              <div className='flex flex-col gap-2 p-2'>
                <span className='font-bold text-sm text-gray-300'>
                  {queue[currentIndex + 1]?.data.title}
                </span>
                <span className='text-xs text-zinc-400'>
                  {queue[currentIndex + 1]?.data.artist.name}
                </span>
              </div>
              {user && (
                <div className='flex justify-center items-center absolute right-5'>
                  <ToggleLikeSong
                    trackId={String(queue[currentIndex + 1].data.id)}
                  />
                </div>
              )}
            </div>
          </div>
        )}
        <ScrollBar orientation='vertical' />
      </ScrollArea>
    </div>
  );
};

/*


*/
