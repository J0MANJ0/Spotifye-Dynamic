'use client';

import { useNavigationHistory } from '@/hooks/use-nav';
import { cn } from '@/lib/utils';
import { SignedIn, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import HomeIcon from '@mui/icons-material/Home';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusicStore } from '@/stores/use-music-store';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Library } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { HighlightedText } from './text-highligt';
import { usePlayerStore } from '@/stores/use-player-store';
import { PlaylistSkeleton } from './playlist-skeleton';
import Fuse from 'fuse.js';
import { Album } from '@/types';
import { useChartStore } from '@/stores/use-chart-store';

export const LeftSidebar = () => {
  const { user } = useUser();
  const { pathname, router } = useNavigationHistory();
  const {
    albums,
    likedSongs,
    currentAlbum,
    loadingAlbums: loading,
  } = useMusicStore();

  const { podcasts } = useChartStore();

  const { currentTrack, isPlaying, toggleSong, playAlbum, likedAlbumPlaying } =
    usePlayerStore();

  const scrollToCurrent = useRef<HTMLDivElement | null>(null);

  const [searchAlbum, setSearchAlbum] = useState('');
  const [exp, setExp] = useState(false);

  const filteredAlbums = useMemo(() => {
    if (!searchAlbum) return albums.map((album) => ({ ...album, matches: [] }));

    const fuse = new Fuse(albums, {
      keys: ['title', 'artist'],
      threshold: 0.3,
      includeMatches: true,
    });

    const results = fuse.search(searchAlbum);

    return results.map(({ item, matches }) => ({
      ...item,
      matches,
    }));
  }, [searchAlbum, albums]);

  const handlePlayLikedAlbum = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!likedSongs) return;
    const isCurrentAlbumPlaying = likedSongs.some(
      (song) => song._id === currentTrack?._id
    );

    if (isCurrentAlbumPlaying && likedAlbumPlaying) {
      toggleSong();
    } else {
      playAlbum(likedSongs);
      usePlayerStore.setState({
        likedAlbumPlaying: true,
        madeForYouAlbumPlaying: false,
        artistAlbumPlaying: false,
      });
      useMusicStore.setState({ currentAlbum: null });
    }
  };

  const handlePlayAlbum = (e: React.MouseEvent, album: Album) => {
    e.stopPropagation();
    if (!album) return;
    const isCurrentAlbumPlaying = album?.tracks.some(
      (track) => track._id === currentTrack?._id
    );

    if (isCurrentAlbumPlaying) {
      toggleSong();
    } else {
      playAlbum(album.tracks);
      usePlayerStore.setState({
        likedAlbumPlaying: false,
        madeForYouAlbumPlaying: false,
        artistAlbumPlaying: false,
      });
      useMusicStore.setState({ currentAlbum: album });
    }
  };

  useEffect(() => {
    if (
      scrollToCurrent.current &&
      currentAlbum &&
      pathname.includes(currentAlbum._id)
    ) {
      scrollToCurrent.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentAlbum?._id, scrollToCurrent.current, currentAlbum]);

  return (
    <div className='h-full flex flex-col gap-1'>
      <div className='rounded-lg bg-zinc-900 p-4'>
        <div className='space-y-2'>
          <Link
            href={'/'}
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'w-full justify-start text-white hover:bg-zinc-800',
              })
            )}
          >
            <HomeIcon
              fontSize='small'
              sx={{ color: `${pathname === '/' ? 'green' : '#fff'}` }}
            />
            <span
              className={`hidden md:inline-block ${
                pathname === '/' ? 'text-green-400' : 'text-white'
              }`}
            >
              Home
            </span>
          </Link>
          <SignedIn>
            <Link
              href={'/chat'}
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  className:
                    'w-full justify-start text-white hover:bg-zinc-800 flex  items-center',
                })
              )}
            >
              <ChatBubbleIcon
                fontSize='small'
                sx={{
                  color: `${pathname === '/chat' ? 'green' : '#fff'}`,
                }}
              />
              <span
                className={`hidden md:inline-block ${
                  pathname === '/chat' ? 'text-green-400' : 'text-white'
                }`}
              >
                Messages
              </span>
            </Link>
          </SignedIn>
        </div>
      </div>
      <div className='flex-1 rounded-lg bg-zinc-900 p-3'>
        <div className='flex items-center text-white px-2'>
          <div className='flex items-center text-white px-2'>
            <Library className='mr-2 size-5' />
            <span className='hidden md:inline-block'>Playlists</span>
          </div>
        </div>

        <ScrollArea className='h-[calc(100vh-355px)]'>
          <div className='flex justify-between items-center mt-1'>
            <AnimatePresence>
              {!exp && (
                <motion.div
                  key={'search-icon'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6 }}
                  className='hover:bg-zinc-800 hover:rounded-full'
                >
                  <IconButton
                    onClick={() => setExp(true)}
                    sx={{ color: '#ccc' }}
                  >
                    <SearchIcon fontSize='medium' />
                  </IconButton>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {exp && (
                <motion.div
                  key={'search-input'}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 300, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ overflow: 'hidden' }}
                >
                  <InputBase
                    autoFocus
                    value={searchAlbum}
                    onChange={(e) => setSearchAlbum(e.target.value)}
                    onBlur={() => !searchAlbum && setExp(false)}
                    placeholder='Search albums,artists...'
                    sx={{
                      ml: 1,
                      flex: 1,
                      color: 'white',
                      backgroundColor: '#1e1e1e',
                      px: 2,
                      py: 0.5,
                      borderRadius: '8px',
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            className={`${
              pathname === '/podcasts' && 'bg-zinc-800'
            } rounded-md hover:bg-zinc-800 my-2`}
            onClick={() => router.push('/podcasts')}
          >
            <div>
              <div className='p-2 rounded-md flex items-center gap-3 group cursor-pointer relative'>
                <div className='size-12 rounded-md flex justify-center items-center bg-green-400/40'>
                  <BookmarkIcon fontSize='small' sx={{ color: '#aacc00' }} />
                </div>
                <div className='flex-1 min-w-0 hidden md:block'>
                  <p
                    className={cn(
                      'font-medium truncate',
                      pathname === '/podcasts' && 'text-green-400'
                    )}
                  >
                    Your Episodes
                  </p>
                  <p className='font-medium text-zinc-400 truncate'>
                    Playlist • {podcasts?.length}{' '}
                    {podcasts?.length === 1 ? 'episode' : 'episodes'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {user && (
            <div
              className={`${
                location.pathname === '/liked-songs' && 'bg-zinc-800'
              } rounded-md hover:bg-zinc-800 my-2`}
              onClick={() => router.push('/liked-songs')}
            >
              <div>
                <div className='p-2 rounded-md flex items-center gap-3 group cursor-pointer relative'>
                  <div
                    className='hidden group-hover:block absolute left-4 top-4'
                    onClick={handlePlayLikedAlbum}
                  >
                    {isPlaying && likedAlbumPlaying ? (
                      <PauseIcon fontSize='large' sx={{ color: '#edf6f9' }} />
                    ) : (
                      <PlayArrowIcon
                        fontSize='large'
                        sx={{ color: '#edf6f9' }}
                      />
                    )}
                  </div>
                  <img
                    src='/liked-songs-2.jpeg'
                    alt='liked-songs'
                    className='size-12 rounded-md shrink-0 object-cover'
                  />
                  <div className='flex-1 min-w-0 hidden md:block'>
                    <p
                      className={cn(
                        'font-medium truncate',
                        likedAlbumPlaying && 'text-green-400'
                      )}
                    >
                      Liked Songs
                    </p>
                    <p className='font-medium text-zinc-400 truncate'>
                      Playlist • {likedSongs?.length}{' '}
                      {likedSongs?.length === 1 ? 'episode' : 'songs'}
                    </p>
                  </div>
                  {isPlaying && likedAlbumPlaying && (
                    <div className='flex justify-center items-center'>
                      <VolumeUpRoundedIcon
                        fontSize='small'
                        sx={{ color: '#4ade80' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className='space-y-2'>
            {loading ? (
              <PlaylistSkeleton />
            ) : (
              filteredAlbums.map((album) => (
                <div
                  key={album._id}
                  onClick={() => router.push(`/albums/${album.data.id}`)}
                  ref={scrollToCurrent}
                >
                  <div
                    className={cn(
                      'p-2 rounded-md flex items-center gap-3 group cursor-pointer relative hover:bg-zinc-800',
                      pathname === `/albums/${album?.data?.id}` && 'bg-zinc-800'
                    )}
                  >
                    <div
                      className='hidden group-hover:block absolute left-4 top-4'
                      onClick={(e) => handlePlayAlbum(e, album)}
                    >
                      {isPlaying && currentAlbum?._id === album?._id ? (
                        <PauseIcon fontSize='large' sx={{ color: '#edf6f9' }} />
                      ) : (
                        <PlayArrowIcon
                          fontSize='large'
                          sx={{ color: '#edf6f9' }}
                        />
                      )}
                    </div>

                    <img
                      src={album.data.cover_medium}
                      alt={album.data.title}
                      className='size-12 rounded-md shrink-0 object-cover'
                    />
                    <div className='flex-1 min-w-0 hidden md:block'>
                      {!searchAlbum ? (
                        <p
                          className={`font-medium truncate line-clamp-1 ${
                            currentAlbum?._id === album?._id && 'text-green-400'
                          }`}
                        >
                          {album.data.title}
                        </p>
                      ) : (
                        <HighlightedText
                          text={album.data.title}
                          indices={
                            album.matches?.find((m) => m.key === 'title')
                              ?.indices
                          }
                        />
                      )}
                      {!searchAlbum ? (
                        <p className='font-medium text-zinc-400 truncate'>
                          Album • {album?.tracks?.length}{' '}
                          {album?.tracks?.length === 1 ? 'song' : 'songs'}
                        </p>
                      ) : (
                        <HighlightedText
                          text={album.data.artist.name}
                          indices={
                            album.matches?.find((m) => m.key === 'artist')
                              ?.indices
                          }
                        />
                      )}
                    </div>
                    {currentAlbum?._id === album?._id && isPlaying && (
                      <div className='flex justify-center items-center'>
                        <VolumeUpRoundedIcon
                          fontSize='small'
                          sx={{ color: '#4ade80' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
