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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Tooltip } from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import { Track } from '@/types';
import { useUser } from '@clerk/nextjs';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Clock, Play } from 'lucide-react';
import { SearchFilterDropdown } from '@/components/search-filter-dropdown';
import { useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import { useNavigationHistory } from '@/hooks/use-nav';
import { ToggleLikeSong } from '@/components/toggle-like';
const MadeForYouPage = () => {
  const [gradient, setGradient] = useState('');
  const [gradientActive, setGradientActive] = useState('');
  const [hover, setHover] = useState(false);
  const [search, setSearch] = useState('');
  const { router } = useNavigationHistory();

  const scrollToCurrent = useRef<HTMLDivElement | null>(null);

  const { user } = useUser();
  const {
    madeforyou,
    fetchLikedSongs,
    fetchMadeForYou,
    unLike,
    reverseSongsOrder,
    searchKeys,
    sortKey,
  } = useMusicStore();
  const {
    isPlaying,
    currentTrack,
    playAlbum,
    toggleSong,
    madeForYouAlbumPlaying,
  } = usePlayerStore();

  const handlePlayAlbum = () => {
    if (!madeforyou) return;
    const isCurrentAlbumPlaying = madeforyou.some(
      (track) => track.trackId === currentTrack?.trackId
    );

    if (isCurrentAlbumPlaying && madeForYouAlbumPlaying) {
      toggleSong();
    } else {
      playAlbum(madeforyou);
      usePlayerStore.setState({
        likedAlbumPlaying: false,
        madeForYouAlbumPlaying: true,
      });
    }
  };

  const activeFilterKeys = useMemo(() => {
    return searchKeys.length > 0 ? searchKeys : ['title', 'artist'];
  }, [searchKeys]);

  const filteredLikedSongs = useMemo(() => {
    const sortedSongs = [...madeforyou];

    return reverseSongsOrder ? sortedSongs.reverse() : sortedSongs;
  }, []);

  const handlePlaySong = (song: Track) => {
    if (!filteredLikedSongs) return;
    const songIdx = filteredLikedSongs.findIndex((s) => s._id === song._id);

    if (songIdx === -1) return;
    playAlbum(filteredLikedSongs, songIdx);
    usePlayerStore.setState({
      likedAlbumPlaying: false,
      madeForYouAlbumPlaying: true,
    });
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
    usePlayerStore.setState({ queue: madeforyou });
  }, []);

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
              src={user?.imageUrl}
              alt={`for-${user?.fullName}`}
              className='size-60 shadow-xl rounded'
            />
            <div className='flex flex-col justify-end'>
              <p className='text-sm font-medium text-gray-300'>Playlist</p>
              <motion.h2
                className='text-7xl font-extrabold my-4'
                initial={{ opacity: 0, y: -25, color: '#000' }}
                animate={{ opacity: 1, y: 0, color: '#fff' }}
                transition={{ duration: 0.7 }}
                translate='yes'
              >
                For {user?.fullName}
              </motion.h2>
              <div className='flex items-center gap-2 text-sm text-gray-400'>
                <img
                  src={user?.imageUrl}
                  alt={user?.fullName ?? 'user'}
                  className='size-6 rounded-full object-cover'
                />
                <span className='font-bold text-white hover:underline'>
                  {user?.fullName}
                </span>
                <span className='font-medium'>
                  • {madeforyou.length}{' '}
                  {madeforyou.length === 1 ? 'song' : 'songs'},
                </span>
                <span>{albumTimeLength(madeforyou || [])}</span>
              </div>
            </div>
          </div>

          <div className='px-6 pb-4 flex items-center justify-between gap-6'>
            <div className='flex justify-between items-center gap-5'>
              <button
                onClick={handlePlayAlbum}
                className='size-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-[1.030] transition-all flex justify-center items-center'
                disabled={!madeforyou?.length}
                style={{
                  cursor: !madeforyou?.length ? 'not-allowed' : 'pointer',
                  opacity: !madeforyou?.length ? 0.5 : 1,
                }}
              >
                {isPlaying &&
                madeforyou?.some((song) => song._id === currentTrack?._id) &&
                madeForYouAlbumPlaying ? (
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
            <div className='grid grid-cols-[16px_4fr_3fr_2fr_1fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5'>
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
                  const iscurrentTrack = currentTrack?._id === track._id;
                  return (
                    <div
                      ref={
                        iscurrentTrack && madeForYouAlbumPlaying
                          ? scrollToCurrent
                          : null
                      }
                      onClick={() => {
                        if (iscurrentTrack && madeForYouAlbumPlaying) {
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
                      className={`grid grid-cols-[16px_4fr_3fr_2fr_1fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer ${
                        iscurrentTrack &&
                        madeForYouAlbumPlaying &&
                        `ring-1 ring-green-500`
                      }`}
                      style={{
                        backgroundColor:
                          iscurrentTrack && madeForYouAlbumPlaying
                            ? `${gradientActive}`
                            : '',
                      }}
                    >
                      <div className='flex items-center justify-center'>
                        {iscurrentTrack &&
                        isPlaying &&
                        madeForYouAlbumPlaying ? (
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
                              iscurrentTrack && madeForYouAlbumPlaying
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
                          {!search ? (
                            <div
                              className={`font-bold ${
                                iscurrentTrack && madeForYouAlbumPlaying
                                  ? 'text-green-500'
                                  : 'text-white'
                              }`}
                            >
                              {track.data.title}
                            </div>
                          ) : (
                            <HighlightedText
                              text={track.data.title}
                              indices={
                                track.matches?.find(
                                  (m: any) => m.key === 'title'
                                )?.indices
                              }
                            />
                          )}
                          {!search ? (
                            <div className='hover:underline'>
                              {track.data.artist.name}
                            </div>
                          ) : (
                            <HighlightedText
                              text={track.data.artist.name}
                              indices={
                                track.matches?.find(
                                  (m: any) => m.key === 'artist'
                                )?.indices
                              }
                            />
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
                        {formatDistanceToNow(
                          new Date(track.data.release_date),
                          {
                            addSuffix: true,
                          }
                        )}
                      </div>
                      <div className='flex items-center'>
                        {formatTime(track.duration)}
                      </div>
                      <div className='flex items-center'>
                        {user && (
                          <Tooltip
                            placement='top'
                            title='Remove from Liked Songs'
                          >
                            <ToggleLikeSong trackId={String(track.trackId)} />
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
export default MadeForYouPage;
