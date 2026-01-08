'use client';

import { useUser } from '@clerk/clerk-react';
import { ToggleLikeSong } from '@/components/toggle-like';
import {
  albumTimeLength,
  bgActive,
  bgGradient,
  formatDuration,
} from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useMusicStore } from '@/stores/use-music-store';
import { useParams } from 'next/navigation';
import { usePlayerStore } from '@/stores/use-player-store';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Fuse from 'fuse.js';
import { Track } from '@/types';
import { Input } from '@/components/ui/input';
import { Clock, Play, SearchIcon } from 'lucide-react';
import { HighlightedText } from '@/components/text-highligt';
import { PlayingBars } from '@/components/playing-bars';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExplicitIcon from '@mui/icons-material/Explicit';
import { useNavigationHistory } from '@/hooks/use-nav';
import { AlbumPageSkeleton } from '@/components/album-skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tooltip } from '@mui/material';
import Image from 'next/image';
import { useAuthStore } from '@/stores/use-auth-store';

const AlbumPage = () => {
  const { user } = useUser();
  const {
    fetchAlbum,
    currentAlbumId,
    loadingAlbum: loading,
    album,
    albumsByIds,
  } = useMusicStore();
  const { albumId } = useParams<{ albumId: string }>();
  const {
    currentTrackId,
    isPlaying,
    playAlbum,
    toggleSong,
    likedAlbumPlaying,
    madeForYouAlbumPlaying,
  } = usePlayerStore();
  const { explicitContent } = useAuthStore();
  const { router, pathname } = useNavigationHistory();
  const [hover, setHover] = useState(false);
  const [exp, setExp] = useState(false);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [gradient, setGradient] = useState<string>('');
  const [gradientActive, setGradientActive] = useState('');

  const currentAlbum = albumsByIds[currentAlbumId!];

  const q = album?.tracks.map((t) => t._id);

  const scrollToCurrent = useRef<HTMLDivElement | null>(null);

  const filteredTracks = useMemo(() => {
    if (!explicitContent) {
      const filtered = album?.tracks?.filter((t) => !t?.data?.explicit_lyrics);
      return filtered;
    }

    return album?.tracks;
  }, [search, album?.tracks, explicitContent]);

  useEffect(() => {
    if (pathname === `/albums/${albumId}`) {
      fetchAlbum(Number(albumId));
      setGradient(bgGradient());
      setGradientActive(bgActive());
    }
  }, [fetchAlbum, albumId, pathname]);

  useEffect(() => {
    if (!filteredTracks) return;
    if (scrollToCurrent.current) {
      scrollToCurrent.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [filteredTracks, currentTrackId]);

  if (loading) {
    return <AlbumPageSkeleton />;
  }

  const handlePlayAlbum = () => {
    if (!album) return;
    const iscurrentAlbumIdPlaying = album?.tracks.some(
      (track) => track._id === currentTrackId
    );

    if (iscurrentAlbumIdPlaying && !likedAlbumPlaying) {
      toggleSong();
    } else {
      playAlbum(q!, 'album');
      usePlayerStore.setState({
        likedAlbumPlaying: false,
        madeForYouAlbumPlaying: false,
        toastShown: false,
      });
      useMusicStore.setState({ currentAlbumId: album._id });
    }
  };

  const handlePlaySong = (track: Track) => {
    if (!album) return;

    const songIdx = album.tracks.findIndex((s) => s._id === track._id);

    if (songIdx === -1) return;
    playAlbum(q!, 'album', album?._id, songIdx);
    usePlayerStore.setState({
      likedAlbumPlaying: false,
      madeForYouAlbumPlaying: false,
      toastShown: false,
    });
    useMusicStore.setState({ currentAlbumId: album._id });
  };

  return (
    <ScrollArea className='h-full rounded-md bg-zinc-700/30'>
      <div
        className='absolute inset-0 bg-linear-to-b via-zinc-900/80 to-zinc-900 pointer-events-none rounded-md'
        aria-hidden='true'
        style={{
          backgroundImage: `linear-gradient(to bottom, ${gradient}80, rgba(24,24,27,0.8), rgba(24,24,27,1))`,
        }}
      />
      <div className='relative min-h-full'>
        <div className='relative z-10'>
          <div className='flex p-6 space-x-6 pb-8'>
            <div className='flex justify-center items-center'>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                  <img
                    src={album?.data?.cover_xl!}
                    alt={album?.data?.title!}
                    className='h-[230px] w-[230px] shadow-xl hover:scale-[1.030] transition-all cursor-pointer rounded-md'
                  />
                </DialogTrigger>

                <DialogHeader>
                  <DialogTitle></DialogTitle>
                </DialogHeader>
                <DialogContent className='bg-transparent border-none shadow-none'>
                  <div className='w-full h-full'>
                    <img
                      src={album?.data?.cover_xl!}
                      alt={album?.data?.title!}
                      className='object-cover w-full h-full'
                    />
                  </div>
                  <div className='mt-3 flex justify-center items-center font-semibold'>
                    <button
                      onClick={() => setOpen(false)}
                      className='cursor-pointer'
                    >
                      Close
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className='flex flex-col justify-end'>
              <p className='text-sm font-medium'>Album</p>
              <motion.h2
                className='sm:text-3xl md:text-4xl lg:text-5xl font-extrabold my-4'
                initial={{ opacity: 0, y: -25, color: '#000' }}
                animate={{ opacity: 1, y: 0, color: '#fff' }}
                transition={{ duration: 0.7 }}
                translate='yes'
              >
                {album?.data?.title}
              </motion.h2>
              <div className='flex items-center gap-2 text-sm text-zinc-400'>
                <img
                  src={album?.data?.artist?.picture_small!}
                  alt={album?.data?.title!}
                  className='size-8 rounded-full object-cover'
                />
                {album?.data?.contributors.map((c, i) => (
                  <span
                    key={c.id}
                    className='font-mono hover:underline cursor-pointer'
                    onClick={() => router.push(`/artists/${c.id}`)}
                  >
                    {c.name}{' '}
                    {i !== album?.data?.contributors.length - 1 && ' •'}
                  </span>
                ))}
                <span className='font-mono'>
                  • {filteredTracks?.length}{' '}
                  {filteredTracks?.length === 1 ? 'song' : 'songs'}
                </span>
                <Tooltip placement='top' title={album?.data?.release_date}>
                  <span className='font-mono'>
                    • {album?.data?.release_date.split('-')[0]},
                  </span>
                </Tooltip>
                <span className='font-mono'>
                  {albumTimeLength(album?.tracks || [])}
                </span>
              </div>
            </div>
          </div>

          <div className='px-6 pb-4 flex items-center gap-6 justify-between relative'>
            <button
              onClick={handlePlayAlbum}
              className='size-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-[1.030] transition-all flex justify-center items-center'
            >
              {isPlaying && currentAlbumId === album?._id ? (
                <PauseIcon fontSize='medium' sx={{ color: '#000' }} />
              ) : (
                <PlayArrowIcon fontSize='medium' sx={{ color: '#000' }} />
              )}
            </button>
            {exp && (
              <motion.span
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                exit={{ opacity: 0, x: -5 }}
              >
                <Input
                  placeholder='Search track,artist...'
                  className='bg-zinc-700 rounded-2xl w-[300px]'
                  onChange={(e) => {
                    e.stopPropagation();
                    setSearch(e.target.value);
                  }}
                />
              </motion.span>
            )}
            <span
              className={`p-2 absolute right-9 cursor-pointer ${
                !exp && 'hover:bg-zinc-700'
              } rounded-full`}
            >
              <SearchIcon
                onClick={() => setExp((p) => !p)}
                className='size-5'
              />
            </span>
          </div>

          <div className='bg-black/20 backdrop-blur-sm'>
            <div className='grid grid-cols-[16px_4fr_2fr_1fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5'>
              <div>#</div>
              <div>Title</div>
              <div>Date Released</div>
              <div>
                <Clock className='size-4' />
              </div>
              <div></div>
            </div>

            <div className='px-6'>
              <div className='py-4 space-y-2'>
                {filteredTracks &&
                  filteredTracks.map((track, i) => {
                    const iscurrentTrackId = currentTrackId === track._id;
                    return (
                      <div
                        ref={iscurrentTrackId ? scrollToCurrent : null}
                        onClick={() => {
                          if (
                            iscurrentTrackId &&
                            !likedAlbumPlaying &&
                            !madeForYouAlbumPlaying
                          ) {
                            toggleSong();
                          } else {
                            handlePlaySong(track);
                          }
                        }}
                        onMouseEnter={() => {
                          if (iscurrentTrackId) setHover(true);
                        }}
                        onMouseLeave={() => {
                          if (iscurrentTrackId) setHover(false);
                        }}
                        key={track._id}
                        className={`grid grid-cols-[16px_4fr_2fr_1fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer ${
                          iscurrentTrackId &&
                          !likedAlbumPlaying &&
                          !madeForYouAlbumPlaying &&
                          `ring-1 ring-green-500`
                        }`}
                        style={{
                          backgroundColor:
                            iscurrentTrackId &&
                            !likedAlbumPlaying &&
                            !madeForYouAlbumPlaying
                              ? `${gradientActive}`
                              : '',
                        }}
                      >
                        <div className='flex items-center justify-center'>
                          {iscurrentTrackId &&
                          isPlaying &&
                          !likedAlbumPlaying &&
                          !madeForYouAlbumPlaying ? (
                            <div className='size-4 text-green-500 text-xl flex justify-center items-center'>
                              {hover ? (
                                <PauseIcon
                                  fontSize='small'
                                  sx={{ color: '#fff' }}
                                />
                              ) : (
                                <PlayingBars />
                              )}
                            </div>
                          ) : (
                            <span
                              className={`group-hover:hidden ${
                                iscurrentTrackId &&
                                !likedAlbumPlaying &&
                                !madeForYouAlbumPlaying
                                  ? 'text-green-500'
                                  : 'text-white'
                              }`}
                            >
                              {i + 1}
                            </span>
                          )}
                          {!iscurrentTrackId ? (
                            <Play className='size-4 hidden group-hover:block' />
                          ) : (
                            <Play className='size-4 hidden group-hover:block text-green-400' />
                          )}
                        </div>
                        <div className='flex items-center gap-3'>
                          <Image
                            src={track.data.album.cover_medium}
                            alt={track.data.title}
                            className='size-10 rounded-[3px]'
                            width={20}
                            height={20}
                          />

                          <div>
                            {!search && (
                              <div
                                className={`font-bold ${
                                  iscurrentTrackId &&
                                  !likedAlbumPlaying &&
                                  !madeForYouAlbumPlaying
                                    ? 'text-green-500'
                                    : 'text-white'
                                }`}
                              >
                                {track?.data?.title}
                              </div>
                            )}
                            {!search && (
                              <div className='hover:underline flex justify-start items-center'>
                                <span>
                                  {track?.data?.explicit_lyrics && (
                                    <ExplicitIcon fontSize='small' />
                                  )}
                                </span>
                                {track?.data?.contributors.map((c, i) => (
                                  <span key={c.id}>
                                    {c.name}
                                    {i !==
                                      track?.data?.contributors.length - 1 &&
                                      ','}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className='flex items-center'>
                          {formatDistanceToNow(
                            new Date(track?.data?.release_date),
                            {
                              addSuffix: false,
                            }
                          )}
                        </div>
                        <div className='flex items-center'>
                          {formatDuration(track?.duration)}
                        </div>

                        <div className='flex items-center'>
                          {user && (
                            <ToggleLikeSong trackId={String(track?.trackId)} />
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScrollBar orientation='vertical' />
    </ScrollArea>
  );
};
export default AlbumPage;
