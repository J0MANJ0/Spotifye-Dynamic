'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { usePlayerStore } from '@/stores/use-player-store';
import { useMusicStore } from '@/stores/use-music-store';
import { Separator } from './ui/separator';
import { X } from 'lucide-react';

export const CreditsDialog = () => {
  const [open, setOpen] = useState(false);
  const { currentTrack } = usePlayerStore();
  const { fetchAlbumDialog, albumDialog, albums } = useMusicStore();

  useEffect(() => {
    if (currentTrack) fetchAlbumDialog(currentTrack?.data?.album?.id);
  }, [currentTrack?.data?.album?.id]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <span className='text-sm font-semibold text-gray-400 hover:underline cursor-pointer hover:text-white'>
          Show all
        </span>
      </DialogTrigger>
      <DialogContent className='bg-zinc-900 select-none border-none'>
        <DialogHeader className='flex flex-row justify-between items-center'>
          <DialogTitle className='text-3xl'>Credits</DialogTitle>
          <div className='flex flex-row justify-between items-center'>
            <button
              className='text-sm font-semibold mr-5'
              onClick={() => setOpen(false)}
            >
              <X className='h-6 w-6 font-mono text-gray-300 hover:scale-105' />
            </button>
          </div>
        </DialogHeader>
        <Separator className='my-4' />

        <div className='w-full flex flex-col p-2 gap-4'>
          <div>
            <h3 className='text-sm font-semibold'>
              {currentTrack?.data.title}
            </h3>
          </div>
          <div className=''>
            <div className='flex flex-col'>
              <div>
                <p className='text-xs font-medium'>Performed by</p>
              </div>
              <div>
                <p>
                  {currentTrack?.data.contributors.map((c, i) => (
                    <a
                      href={c.link}
                      key={c.id}
                      className='text-xs text-muted-foreground font-mono hover:underline hover:text-white'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {c.name}
                      {i !== currentTrack.data.contributors.length - 1 && ','}
                    </a>
                  ))}
                </p>
              </div>
            </div>
          </div>
          <div className=''>
            <div className='flex flex-col'>
              <div>
                <p className='font-medium text-xs'>Album</p>
              </div>
              <div>
                <p className='font-mono text-muted-foreground text-xs'>
                  <a
                    href={currentTrack?.data.album.link}
                    className='hover:underline hover:text-white'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {currentTrack?.data?.album?.title}
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className=''>
            <div className='flex flex-col'>
              <div>
                <p className='font-medium text-xs'>Label</p>
              </div>
              <div>
                <p className='font-mono text-muted-foreground text-xs'>
                  {albumDialog?.data.label}
                </p>
              </div>
            </div>
          </div>

          <div className=''>
            <div className='flex flex-col'>
              <div>
                <p className='font-medium text-xs'>Genre Type</p>
              </div>
              <div>
                <p className='font-mono text-muted-foreground text-xs'>
                  {albumDialog?.data.genres.data.map((g, i) => (
                    <span key={g.id}>{g.name}</span>
                  ))}
                </p>
              </div>
            </div>
          </div>

          <div className=''>
            <div className='flex flex-col'>
              <div>
                <p className='font-medium text-xs'>Explicit</p>
              </div>
              <div>
                <p className='font-mono text-muted-foreground text-xs'>
                  {currentTrack?.data?.explicit_lyrics ? 'True' : 'False'}
                </p>
              </div>
            </div>
          </div>
          <div className=''>
            <div className='flex flex-col'>
              <div>
                <p className='font-medium text-xs'>Source</p>
              </div>
              <div>
                <p className='font-mono text-muted-foreground text-xs'>
                  <a
                    href={currentTrack?.data.link}
                    className='hover:underline hover:text-white'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {currentTrack?.data?.title}
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className='flex flex-col justify-start text-xs font-light text-muted-foreground'>
            <div>
              Released: {currentTrack?.data?.release_date}, Rank:
              {currentTrack?.data?.rank}, ISRC:{currentTrack?.data?.isrc}
            </div>
            <div>
              BPM: {currentTrack?.data?.bpm}, GAIN: {currentTrack?.data?.gain}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
