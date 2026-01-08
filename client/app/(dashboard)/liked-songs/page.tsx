'use client';

import { PlayingBars } from '@/components/playing-bars';
import { HighlightedText } from '@/components/text-highligt';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  albumTimeLength,
  bgActive,
  bgGradientLiked,
  formatTime,
} from '@/lib/utils';
import { useMusicStore } from '@/stores/use-music-store';
import { usePlayerStore } from '@/stores/use-player-store';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExplicitIcon from '@mui/icons-material/Explicit';
import { Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { Track } from '@/types';
import { useUser } from '@clerk/nextjs';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Clock, Play } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import { useNavigationHistory } from '@/hooks/use-nav';
import { useAuthStore } from '@/stores/use-auth-store';

const LikedSongsPage = () => {
  const [gradient, setGradient] = useState('');
  const [gradientActive, setGradientActive] = useState('');
  const [hover, setHover] = useState(false);
  const [search, setSearch] = useState('');
  const { router } = useNavigationHistory();
  const { explicitContent } = useAuthStore();

  const scrollToCurrent = useRef<HTMLDivElement | null>(null);

  const { user } = useUser();
  const {
    likedSongs,
    unLike,
    reverseSongsOrder,
    searchKeys,
    sortKey,
    tracksByIds,
  } = useMusicStore();
  const {
    isPlaying,
    likedAlbumPlaying,
    currentTrackId,
    playAlbum,
    toggleSong,
  } = usePlayerStore();

  const currentTrack = tracksByIds[currentTrackId!];

  const activeFilterKeys = useMemo(() => {
    return searchKeys.length > 0 ? searchKeys : ['title', 'artist'];
  }, [searchKeys]);

  const filteredLikedSongs = useMemo(() => {
    if (!explicitContent) {
      const filtered = likedSongs?.filter((t) => !t?.data?.explicit_lyrics);
      return filtered;
    }

    return likedSongs;
  }, [
    search,
    likedSongs,
    reverseSongsOrder,
    activeFilterKeys,
    searchKeys,
    sortKey,
  ]);

  const handlePlayAlbum = () => {
    if (!filteredLikedSongs) return;
    const iscurrentAlbumIdPlaying = filteredLikedSongs.some(
      (track) => track.trackId === currentTrack.trackId
    );

    if (iscurrentAlbumIdPlaying && likedAlbumPlaying) {
      toggleSong();
    } else {
      const q = filteredLikedSongs.map((t) => t._id);
      playAlbum(q, 'likedSongsAlbum');
    }
  };

  const handlePlaySong = (song: Track) => {
    if (!filteredLikedSongs) return;
    const songIdx = filteredLikedSongs.findIndex((s) => s._id === song._id);

    if (songIdx === -1) return;
    const q = filteredLikedSongs.map((t) => t._id);
    playAlbum(q, 'likedSongsAlbum', null, songIdx);
  };

  useEffect(() => {
    if (scrollToCurrent.current && filteredLikedSongs.length > 0) {
      scrollToCurrent.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [filteredLikedSongs, currentTrack?._id]);

  useEffect(() => {
    setGradient(bgGradientLiked());
    setGradientActive(bgActive());
  }, []);

  return (
    <ScrollArea className='h-full rounded-md bg-zinc-700/30'>
      <div
        className='absolute inset-0 bg-linear-to-b via-zinc-900/80 to-zinc-900 pointer-events-none'
        aria-hidden='true'
        style={{
          backgroundImage: `linear-gradient(to bottom, ${gradient}80, rgba(24,24,27,0.8), rgba(24,24,27,1))`,
        }}
      />
      <div className='min-h-full relative'>
        <div className='relative z-10'>
          <div className='flex p-6 gap-6 pb-8'>
            <img
              src='/liked-songs.jpeg'
              alt='liked-songs'
              className='size-60 shadow-xl rounded'
            />
            <div className='flex flex-col justify-end'>
              <p className='text-sm font-medium text-gray-300'>Playlist</p>
              <motion.h2
                className='text-8xl font-extrabold my-4'
                initial={{ opacity: 0, y: -25, color: '#000' }}
                animate={{ opacity: 1, y: 0, color: '#fff' }}
                transition={{ duration: 0.7 }}
                translate='yes'
              >
                Liked Songs
              </motion.h2>
              <div className='flex items-center gap-1 text-sm text-gray-400'>
                <img
                  src={user?.imageUrl}
                  alt={user?.fullName ?? 'user'}
                  className='size-6 rounded-full object-cover'
                />
                <span
                  className='font-bold text-white hover:underline cursor-pointer'
                  onClick={() => router.push('/profile')}
                >
                  {user?.fullName}
                </span>
                <span className='font-medium'>
                  • {filteredLikedSongs.length}{' '}
                  {filteredLikedSongs.length === 1 ? 'song' : 'songs'},
                </span>
                <span>{albumTimeLength(filteredLikedSongs || [])}</span>
              </div>
            </div>
          </div>

          <div className='px-6 pb-4 flex items-center justify-between gap-6'>
            <div className='flex justify-between items-center gap-5'>
              <button
                onClick={handlePlayAlbum}
                className='size-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-[1.030] transition-all flex justify-center items-center'
                disabled={!filteredLikedSongs?.length}
                style={{
                  cursor: !filteredLikedSongs?.length
                    ? 'not-allowed'
                    : 'pointer',
                  opacity: !filteredLikedSongs?.length ? 0.5 : 1,
                }}
              >
                {isPlaying &&
                filteredLikedSongs?.some(
                  (song) => song._id === currentTrack?._id
                ) &&
                likedAlbumPlaying ? (
                  <PauseIcon fontSize='medium' sx={{ color: '#000' }} />
                ) : (
                  <PlayArrowIcon fontSize='medium' sx={{ color: '#000' }} />
                )}
              </button>
            </div>

            <div className='flex justify-between items-center gap-3'>
              <Input
                placeholder='Search song,artist...'
                className='bg-zinc-700 rounded-2xl w-[300px]'
                onChange={(e) => {
                  e.stopPropagation();
                  setSearch(e.target.value);
                }}
              />
              {/* <SearchFilterDropdown /> */}
            </div>
          </div>

          <div className='bg-black/20 backdrop-blur-sm'>
            <div className='grid grid-cols-[16px_5fr_3fr_2fr_1fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5'>
              <div>#</div>
              <div>Title</div>
              <div>Album</div>
              <div>Date added</div>
              <div>
                <Clock className='size-4' />
              </div>
            </div>

            <div className='px-6'>
              <div className='py-4 space-y-2'>
                {filteredLikedSongs?.map((track, i) => {
                  const iscurrentTrackId = currentTrack?._id === track._id;
                  return (
                    <div
                      ref={
                        iscurrentTrackId && likedAlbumPlaying
                          ? scrollToCurrent
                          : null
                      }
                      onClick={() => {
                        if (iscurrentTrackId && likedAlbumPlaying) {
                          toggleSong();
                        } else {
                          handlePlaySong(track);
                        }
                      }}
                      onMouseEnter={() => {
                        if (currentTrack?._id === track._id) setHover(true);
                      }}
                      onMouseLeave={() => {
                        if (currentTrack?._id === track._id) setHover(false);
                      }}
                      key={track._id}
                      className={`grid grid-cols-[16px_5fr_3fr_2fr_1fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer ${
                        iscurrentTrackId &&
                        likedAlbumPlaying &&
                        `ring-1 ring-green-500`
                      }`}
                      style={{
                        backgroundColor:
                          iscurrentTrackId && likedAlbumPlaying
                            ? `${gradientActive}`
                            : '',
                      }}
                    >
                      <div className='flex items-center justify-center'>
                        {iscurrentTrackId && isPlaying && likedAlbumPlaying ? (
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
                              iscurrentTrackId && likedAlbumPlaying
                                ? 'text-green-500'
                                : 'text-white'
                            }`}
                          >
                            {i + 1}
                          </span>
                        )}
                        {currentTrack?._id !== track._id ? (
                          <Play className='size-4 hidden group-hover:block' />
                        ) : (
                          <Play className='size-4 hidden group-hover:block text-green-400' />
                        )}
                      </div>
                      <div className='flex items-center gap-3'>
                        <img
                          src={track.data.album.cover_medium}
                          alt={track.data.title}
                          className='size-10 rounded-[3px]'
                        />

                        <div>
                          {!search && (
                            <div
                              className={`font-bold ${
                                iscurrentTrackId && likedAlbumPlaying
                                  ? 'text-green-500'
                                  : 'text-white'
                              }`}
                            >
                              {track.data.title}
                            </div>
                          )}
                          {!search && (
                            <div className='hover:underline flex justify-start items-center'>
                              <span>
                                {track.data.explicit_lyrics && (
                                  <ExplicitIcon fontSize='small' />
                                )}
                              </span>
                              {track.data.contributors.map((c, i) => (
                                <span key={c.id}>
                                  {c.name}
                                  {i !== track.data.contributors.length - 1 &&
                                    ','}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='flex items-center'>
                        <span
                          className='hover:underline'
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/albums/${track.data.album.id}`);
                          }}
                        >
                          {track.data.album.title}
                        </span>
                      </div>
                      <div className='flex items-center'>
                        {formatDistanceToNow(new Date(track.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                      <div className='flex items-center'>
                        {formatTime(track.duration)}
                      </div>
                      <div className='items-center hidden group-hover:flex'>
                        {user && (
                          <Tooltip
                            placement='top'
                            title='Remove from Liked Songs'
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                unLike(track.trackId);
                              }}
                              className='cursor-pointer'
                            >
                              <CheckCircleIcon
                                fontSize='small'
                                sx={{ color: '#ccff33' }}
                              />
                            </button>
                          </Tooltip>
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
export default LikedSongsPage;
