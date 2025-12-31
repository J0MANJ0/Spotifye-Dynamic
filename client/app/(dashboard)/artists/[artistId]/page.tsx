'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { useMusicStore } from '@/stores/use-music-store';
import { AnimatePresence, motion } from 'framer-motion';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Loader, MoreHorizontal, Play } from 'lucide-react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExplicitIcon from '@mui/icons-material/Explicit';
import { useParams } from 'next/navigation';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useFollowStore } from '@/stores/use-follow-store';
import { Tooltip } from '@mui/material';
import { useNavigationHistory } from '@/hooks/use-nav';
import { ToggleLikeSong } from '@/components/toggle-like';
import { cn, formatTime } from '@/lib/utils';
import { PlayingBars } from '@/components/playing-bars';
import { usePlayerStore } from '@/stores/use-player-store';
import { Track } from '@/types';

const ArtistPage = () => {
  const {
    artistPage,
    loadingArtistPage: loading,
    likedSongs,
    tracks,
    fetchArtistPage,
  } = useMusicStore();
  const { isPlaying, currentTrack, toggleSong, playAlbum, artistAlbumPlaying } =
    usePlayerStore();
  const { followedArtists, followTarget, unfollowTarget } = useFollowStore();
  const { artistId } = useParams<{ artistId: string }>();
  const { router } = useNavigationHistory();

  const [hover, setHover] = useState(false);
  const [expand, setExpand] = useState(false);

  const likedArtistSongs = useMemo(() => {
    const tracks = likedSongs?.filter((track) =>
      track?.data?.contributors?.some((c) => c.id === artistPage?.data?.id)
    );
    return tracks;
  }, [artistPage?.data?.id, likedSongs]);

  const popularSongs = useMemo(() => {
    const popular = tracks
      ?.filter((track) =>
        track?.data?.contributors.some((c) => c.id === artistPage?.data?.id)
      )
      .sort((a, b) => (b?.data?.rank || 0) - (a?.data?.rank || 0))
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

    return popular;
  }, [artistPage?.data?.id, tracks]);

  const isFollowed = followedArtists?.some(
    (a) => a.target?.data?.id === artistPage?.data?.id
  );

  const handleSubmit = () => {
    isFollowed
      ? unfollowTarget('artists', artistPage?.data?.id)
      : followTarget('artists', artistPage?.data?.id);
  };

  const handlePlayAlbum = () => {
    if (!popularSongs) return;
    const isCurrentAlbumPlaying = popularSongs.some(
      (track) => track.trackId === currentTrack?.trackId
    );

    if (isCurrentAlbumPlaying && artistAlbumPlaying) {
      toggleSong();
    } else {
      playAlbum(popularSongs);
      usePlayerStore.setState({
        likedAlbumPlaying: false,
        madeForYouAlbumPlaying: false,
        artistAlbumPlaying: true,
      });
      useMusicStore.setState({ currentAlbum: null, album: null });
    }
  };

  const handlePlaySong = (song: Track) => {
    if (!popularSongs) return;
    const songIdx = popularSongs.findIndex((s) => s._id === song._id);

    if (songIdx === -1) return;
    playAlbum(popularSongs, songIdx);
    usePlayerStore.setState({
      likedAlbumPlaying: false,
      madeForYouAlbumPlaying: false,
      artistAlbumPlaying: true,
    });
    useMusicStore.setState({ currentAlbum: null, album: null });
  };

  const scrollToCurrent = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollToCurrent.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, []);

  useEffect(() => {
    if (artistPage) {
      scrollToCurrent.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [artistId]);

  useEffect(() => {
    fetchArtistPage(Number(artistId));
  }, [artistId]);

  if (!artistPage) return;

  return (
    <div className='h-full overflow-y-auto rounded-md bg-zinc-900 scrollbar-custom'>
      <ScrollArea className='w-full h-full'>
        <div className='w-full h-full flex flex-col'>
          <div className='w-full relative'>
            <img
              src={artistPage?.data?.picture_xl}
              alt={artistPage?.data?.name}
              className='object-cover w-full brightness-75'
            />
            <div className='absolute bottom-4 left-6 flex flex-col p-2 gap-3'>
              <div className='flex justify-start items-center gap-2'>
                <VerifiedIcon sx={{ fontSize: '25px', color: '#4895ef' }} />{' '}
                <span className='text-sm font-mono'>Verified Artist</span>
              </div>
              <div className='flex justify-start items-center'>
                <h2 className='font-extrabold text-7xl line-clamp-1'>
                  {artistPage?.data?.name}
                </h2>
              </div>
              <div ref={scrollToCurrent} />
              <div className='flex justify-start items-center gap-2'>
                <p className='font-mono text-sm'>
                  {Number(artistPage?.data?.nb_fan).toLocaleString('en-US')}{' '}
                  monthly listeners
                </p>
              </div>
            </div>
          </div>

          <div className='w-full flex flex-col'>
            <div className='flex justify-start items-center p-4 bg-blue-900/10'>
              <div className='flex justify-start items-center gap-6'>
                <button
                  onClick={handlePlayAlbum}
                  className='size-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-[1.030] transition-all flex justify-center items-center'
                  disabled={!popularSongs?.length}
                  style={{
                    cursor: !popularSongs?.length ? 'not-allowed' : 'pointer',
                    opacity: !popularSongs?.length ? 0.5 : 1,
                  }}
                >
                  {isPlaying &&
                  artistAlbumPlaying &&
                  popularSongs?.some(
                    (song) => song._id === currentTrack?._id
                  ) ? (
                    <PauseIcon fontSize='medium' sx={{ color: '#000' }} />
                  ) : (
                    <PlayArrowIcon fontSize='medium' sx={{ color: '#000' }} />
                  )}
                </button>
                <div>
                  <Button
                    className='flex items-center justify-center rounded-2xl bg-zinc-900 text-white text-xs px-8 border border-gray-400 hover:scale-[1.030] hover:border-gray-200 hover:bg-zinc-800 cursor-pointer'
                    onClick={handleSubmit}
                  >
                    {isFollowed ? 'Following' : 'Follow'}
                  </Button>
                </div>
                <div>
                  <Tooltip
                    placement='top'
                    title={`More options for ${artistPage?.data?.name}`}
                  >
                    <div className='cursor-pointer'>
                      <MoreHorizontal className='h-6 w-6 text-muted-foreground' />
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>
            {/*  */}
            <div className='grid grid-cols-2 gap-6 mt-2 p-4'>
              <div className='flex flex-col'>
                <div className='flex justify-start items-center'>
                  <h3 className='text-xl font-bold'>Popular</h3>
                </div>
                <div>
                  {popularSongs.map((track, i) => {
                    const iscurrentTrack =
                      currentTrack?.trackId === track?.trackId;
                    return i <= 4 ? (
                      <Fragment key={track._id}>
                        <div
                          key={track._id}
                          onClick={(e) => {
                            e.preventDefault();

                            if (iscurrentTrack) {
                              toggleSong();
                            } else {
                              handlePlaySong(track);
                            }
                          }}
                          onMouseEnter={() => {
                            if (iscurrentTrack) setHover(true);
                          }}
                          onMouseLeave={() => {
                            if (iscurrentTrack) setHover(false);
                          }}
                          className='grid grid-cols-[2fr_2fr] gap-6 p-2 group hover:bg-zinc-800 rounded-md'
                        >
                          <div className='grid grid-cols-[1fr_2fr]'>
                            <div className='grid grid-cols-[1fr_2fr]'>
                              <div className='flex justify-start items-center'>
                                {isPlaying && iscurrentTrack ? (
                                  hover ? (
                                    <PauseIcon sx={{ fontSize: '20px' }} />
                                  ) : (
                                    <PlayingBars />
                                  )
                                ) : (
                                  <>
                                    <span
                                      className={cn(
                                        'group-hover:hidden',
                                        iscurrentTrack && 'text-green-400'
                                      )}
                                    >
                                      {i + 1}
                                    </span>
                                    <span className='hidden group-hover:block'>
                                      <PlayArrowIcon
                                        sx={{ fontSize: '20px' }}
                                      />
                                    </span>
                                  </>
                                )}
                              </div>
                              <div className='h-10 w-10 flex justify-center'>
                                <img
                                  src={track?.data?.album?.cover_xl}
                                  alt=''
                                  className='object-cover rounded-[1.9px]'
                                />
                              </div>
                            </div>
                            <div className='flex flex-col justify-center'>
                              <p
                                className={cn(
                                  'text-sm line-clamp-1',
                                  iscurrentTrack && 'text-green-400'
                                )}
                              >
                                {track?.data?.title}
                              </p>
                              {track?.data?.explicit_lyrics && (
                                <ExplicitIcon
                                  fontSize='small'
                                  sx={{ color: '#6c757d' }}
                                />
                              )}
                            </div>
                          </div>
                          <div className='grid grid-cols-[2fr_2fr]'>
                            <div className='flex justify-start items-center'>
                              <span className='text-sm text-muted-foreground'>
                                {Number(track?.data?.rank).toLocaleString(
                                  'en-Us'
                                )}
                              </span>
                            </div>
                            <div className='grid grid-cols-[1fr_1fr_1fr] gap-2'>
                              <div className='flex justify-center items-center px-4'>
                                <ToggleLikeSong
                                  trackId={String(track?.data?.id)}
                                />
                              </div>
                              <div className='flex justify-start items-center'>
                                <span className='text-sm text-muted-foreground'>
                                  {formatTime(track?.duration)}
                                </span>
                              </div>
                              <div className='hidden group-hover:block justify-center items-center'>
                                <Tooltip
                                  placement='top'
                                  title={`More options for ${
                                    track?.data?.title
                                  } by ${track?.data?.contributors.map((c) => {
                                    return `${c.name}`;
                                  })}`}
                                >
                                  <div className='flex justify-center items-center py-3 cursor-pointer'>
                                    <MoreHorizontal className='h-4 w-4' />
                                  </div>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        </div>

                        {i === 4 && !expand && (
                          <span
                            className='text-sm text-muted-foreground font-medium px-5  hover:text-white transition-colors cursor-pointer'
                            onClick={() => setExpand((p) => !p)}
                          >
                            See more
                          </span>
                        )}
                      </Fragment>
                    ) : (
                      expand && (
                        <Fragment key={track._id}>
                          <div
                            onMouseEnter={() => {
                              if (currentTrack?.trackId === track?.trackId)
                                setHover(true);
                            }}
                            onClick={(e) => {
                              e.preventDefault();

                              if (iscurrentTrack) {
                                toggleSong();
                              } else {
                                handlePlaySong(track);
                              }
                            }}
                            onMouseLeave={() => {
                              if (currentTrack?.trackId === track?.trackId)
                                setHover(false);
                            }}
                            className='grid grid-cols-[2fr_2fr] gap-6 p-2 group hover:bg-zinc-800 rounded-md'
                          >
                            <div className='grid grid-cols-[1fr_2fr]'>
                              <div className='grid grid-cols-[1fr_2fr]'>
                                <div className='flex justify-start items-center'>
                                  {isPlaying && iscurrentTrack ? (
                                    hover ? (
                                      <PauseIcon sx={{ fontSize: '20px' }} />
                                    ) : (
                                      <PlayingBars />
                                    )
                                  ) : (
                                    <>
                                      <span
                                        className={cn(
                                          'group-hover:hidden',
                                          iscurrentTrack && 'text-green-400'
                                        )}
                                      >
                                        {i + 1}
                                      </span>
                                      <span className='hidden group-hover:block'>
                                        <PlayArrowIcon
                                          sx={{ fontSize: '20px' }}
                                        />
                                      </span>
                                    </>
                                  )}
                                </div>
                                <div className='h-10 w-10 flex justify-center'>
                                  <img
                                    src={track?.data?.album?.cover_xl}
                                    alt=''
                                    className='object-cover rounded-[1.9px]'
                                  />
                                </div>
                              </div>
                              <div className='flex justify-start items-center'>
                                <div className='flex flex-col'>
                                  <p
                                    className={cn(
                                      'text-sm line-clamp-1',
                                      iscurrentTrack && 'text-green-400'
                                    )}
                                  >
                                    {track?.data?.title}
                                  </p>
                                  {track?.data?.explicit_lyrics && (
                                    <ExplicitIcon
                                      fontSize='small'
                                      sx={{ color: '#6c757d' }}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className='grid grid-cols-[2fr_2fr]'>
                              <div className='flex justify-start items-center'>
                                <span className='text-sm text-muted-foreground'>
                                  {Number(track?.data?.rank).toLocaleString(
                                    'en-Us'
                                  )}
                                </span>
                              </div>
                              <div className='grid grid-cols-[1fr_1fr_1fr] gap-2'>
                                <div className='flex justify-center items-center px-4'>
                                  <ToggleLikeSong
                                    trackId={String(track?.data?.id)}
                                  />
                                </div>
                                <div className='flex justify-start items-center'>
                                  <span className='text-sm text-muted-foreground'>
                                    {formatTime(track?.duration)}
                                  </span>
                                </div>
                                <div className='hidden group-hover:block justify-center items-center'>
                                  <div className='flex justify-center items-center py-3'>
                                    <MoreHorizontal className='h-4 w-4' />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {i === 9 && (
                            <span
                              className='text-sm text-muted-foreground font-medium px-5 hover:text-white transition-colors cursor-pointer'
                              onClick={() => setExpand((p) => !p)}
                            >
                              See less
                            </span>
                          )}
                        </Fragment>
                      )
                    );
                  })}
                </div>
              </div>
              <div className='flex gap-6 h-fit'>
                {likedArtistSongs?.length > 0 && (
                  <>
                    <div className='flex flex-col gap-2'>
                      <div className='flex justify-start items-center'>
                        <h3 className='text-xl font-bold'>Liked Songs</h3>
                      </div>
                      <div
                        className='w-18 h-18 relative cursor-pointer'
                        onClick={() =>
                          router.push(
                            `/artist/${artistPage?.data?.id}/liked-songs`
                          )
                        }
                      >
                        <img
                          src={artistPage?.data?.picture_xl}
                          alt={artistPage?.data?.name}
                          className='object-cover rounded-full brightness-75'
                        />
                        <FavoriteIcon
                          className='absolute right-0 bottom-0'
                          sx={{ fontSize: '1.2rem', color: '#4ade80' }}
                        />
                      </div>
                    </div>
                    <div className='flex justify-center items-center'>
                      <div className='flex flex-col justify-end'>
                        <span
                          className='text-md font-semibold hover:underline cursor-pointer'
                          onClick={() =>
                            router.push(
                              `/artist/${artistPage?.data?.id}/liked-songs`
                            )
                          }
                        >
                          You've liked {likedArtistSongs?.length}{' '}
                          {likedArtistSongs?.length === 1 ? 'song' : 'songs'}
                        </span>
                        <span className='text-muted-foreground text-xs font-mono'>
                          By {artistPage?.data?.name}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/*  */}
            </div>
            <div className='grid grid-cols-2 gap-2 mt-2 p-4'>
              <div>songs</div>
              <div>liked-songs</div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
export default ArtistPage;
