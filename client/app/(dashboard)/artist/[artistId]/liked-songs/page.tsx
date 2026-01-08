'use client';
import { Separator } from '@/components/ui/separator';
import { useMusicStore } from '@/stores/use-music-store';
import PauseIcon from '@mui/icons-material/Pause';
import ExplicitIcon from '@mui/icons-material/Explicit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Clock, MoreHorizontal } from 'lucide-react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useNavigationHistory } from '@/hooks/use-nav';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useParams } from 'next/navigation';
import { cn, formatTime } from '@/lib/utils';
import { Tooltip } from '@mui/material';
import { ToggleLikeSong } from '@/components/toggle-like';
import { usePlayerStore } from '@/stores/use-player-store';
import { PlayingBars } from '@/components/playing-bars';
import { Track } from '@/types';

const ArtistLikedSongsPage = () => {
  const { artistPage, likedSongs, fetchArtistPage, tracksByIds } =
    useMusicStore();
  const {
    currentTrackId,
    isPlaying,
    toggleSong,
    playAlbum,
    artistAlbumPlaying,
  } = usePlayerStore();
  const { router } = useNavigationHistory();
  const { artistId } = useParams<{ artistId: string }>();

  const currentTrack = tracksByIds[currentTrackId!];

  const [hover, setHover] = useState(false);

  const likedArtistSongs = useMemo(() => {
    const tracks = likedSongs?.filter((track) =>
      track?.data?.contributors?.some((c) => c.id === artistPage?.data?.id)
    );
    return tracks;
  }, [artistPage?.data?.id, likedSongs]);

  const handlePlayAlbum = () => {
    if (!likedSongs) return;
    const iscurrentAlbumIdPlaying = likedSongs.some(
      (track) => track.trackId === currentTrack.trackId
    );

    if (iscurrentAlbumIdPlaying && artistAlbumPlaying) {
      toggleSong();
    } else {
      const q = likedSongs.map((t) => t._id);
      playAlbum(q, 'artistAlbum');
    }
  };

  const handlePlaySong = (song: Track) => {
    if (!likedSongs) return;
    const songIdx = likedSongs.findIndex((s) => s._id === song._id);

    if (songIdx === -1) return;
    const q = likedSongs.map((t) => t._id);
    playAlbum(q, 'artistAlbum', null, songIdx);
  };
  useEffect(() => {
    fetchArtistPage(Number(artistId));
  }, [artistId, fetchArtistPage]);
  return (
    <div className='bg-zinc-900 rounded-md w-full h-full'>
      <div className='w-full p-4 h-full'>
        <div className='flex p-2 gap-2'>
          <div>
            <button
              onClick={handlePlayAlbum}
              className='size-10 rounded-full bg-green-500 hover:bg-green-400 hover:scale-[1.030] transition-all flex justify-center items-center'
              disabled={!likedSongs?.length}
              style={{
                cursor: !likedSongs?.length ? 'not-allowed' : 'pointer',
                opacity: !likedSongs?.length ? 0.5 : 1,
              }}
            >
              {isPlaying &&
              likedArtistSongs?.some((song) => song._id === currentTrack._id) &&
              artistAlbumPlaying ? (
                <PauseIcon fontSize='medium' sx={{ color: '#000' }} />
              ) : (
                <PlayArrowIcon fontSize='medium' sx={{ color: '#000' }} />
              )}
            </button>
          </div>
          <div className='flex justify-start items-center'>
            <h1 className='text-white text-2xl font-bold'>
              Liked Songs By {artistPage?.data?.name}{' '}
            </h1>
          </div>
        </div>
        <div className='p-2.5 grid grid-cols-[2fr_1fr_1fr]'>
          <div className='flex justify-start gap-4'>
            <span className='text-sm text-muted-foreground font-medium'>#</span>
            <span className='text-sm text-muted-foreground font-medium'>
              Title
            </span>
          </div>
          <div className='flex justify-start'>
            <span className='text-sm text-muted-foreground font-medium'>
              Album
            </span>
          </div>

          <div className='flex justify-center items-center px-6'>
            <div className='flex justify-end items-center'>
              <Clock className='h-4 w-4 text-muted-foreground' />
            </div>
          </div>
        </div>
        <Separator />
        <ScrollArea className='h-[70%] w-full'>
          {likedArtistSongs.map((track, i) => {
            const iscurrentTrackId = currentTrack?.trackId === track?.trackId;
            return (
              <Fragment key={track._id}>
                <div
                  key={track._id}
                  onClick={() => {
                    if (iscurrentTrackId) {
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
                  className='grid grid-cols-[2fr_2fr] p-2 group hover:bg-zinc-800 rounded-md cursor-pointer'
                >
                  <div className='grid grid-cols-[0.5fr_3fr]'>
                    <div className='grid grid-cols-[1fr_2fr]'>
                      <div className='flex justify-start items-center'>
                        {isPlaying && iscurrentTrackId ? (
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
                                iscurrentTrackId && 'text-green-400'
                              )}
                            >
                              {i + 1}
                            </span>
                            <span className='hidden group-hover:flex'>
                              <PlayArrowIcon sx={{ fontSize: '20px' }} />
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
                          iscurrentTrackId && 'text-green-400'
                        )}
                      >
                        {track?.data?.title}
                      </p>
                      <p>
                        {track?.data?.explicit_lyrics && (
                          <ExplicitIcon
                            fontSize='small'
                            sx={{ color: '#6c757d' }}
                          />
                        )}
                        {track?.data?.contributors.map((c, i) => (
                          <span
                            key={c.id}
                            onClick={(e) => {
                              e.stopPropagation(),
                                router.push(`/artists/${c.id}`);
                            }}
                            className='text-xs text-muted-foreground hover:underline cursor-pointer'
                          >
                            {c.name}
                            {i !== track?.data?.contributors.length - 1 && ','}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                  <div className='grid grid-cols-[2fr_2fr]'>
                    <div className='flex justify-start items-center'>
                      <span
                        className='text-sm text-muted-foreground hover:underline cursor-pointer'
                        onClick={(e) => {
                          e.stopPropagation(),
                            router.push(`/albums/${track?.data?.album?.id}`);
                        }}
                      >
                        {track?.data?.album?.title}
                      </span>
                    </div>
                    <div className='grid grid-cols-[1fr_1fr_1.5fr] gap-2'>
                      <div className='flex justify-center items-center px-4'>
                        <div className='hidden group-hover:flex'>
                          <ToggleLikeSong trackId={String(track?.data?.id)} />
                        </div>
                      </div>
                      <div className='flex justify-end items-center'>
                        <span className='text-sm text-muted-foreground'>
                          {formatTime(track?.duration)}
                        </span>
                      </div>
                      <div className='hidden group-hover:flex justify-center items-center'>
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
              </Fragment>
            );
          })}
        </ScrollArea>
      </div>
      <div className='w-full bg-black' />
    </div>
  );
};
export default ArtistLikedSongsPage;
