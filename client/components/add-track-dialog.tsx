'use client';

import { useMusicStore } from '@/stores/use-music-store';
import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { Input } from './ui/input';
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface Track {
  trackId: string;
  albumId: string;
  duration: string;
}

export const AddTrackDialog = () => {
  const { createTrack, loadingTrack: loading, albums } = useMusicStore();
  const [track, setTrack] = useState<Track>({
    trackId: '0',
    albumId: '0',
    duration: '0',
  });
  const [file, setFile] = useState<{ audio: File | null }>({ audio: null });
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);

  const audioRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    try {
      if (!file.audio) return toast.error('Please upload audio file!');

      const formData = new FormData();

      formData.append('trackId', track.trackId);
      formData.append('albumId', track.albumId);
      formData.append('duration', track.duration);
      formData.append('audioFile', file.audio);

      await createTrack(formData);

      setTrack({ trackId: '', albumId: '', duration: '' });
      setFile({ audio: null });
    } catch (error: any) {
      toast.error('Failed to create track:' + error?.message || error);
    }
  };

  return (
    <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
      <DialogTrigger asChild>
        <Button className='bg-emerald-500 hover:bg-emerald-600 text-white'>
          <Plus className='h-4 w-4 mr-2' />
          Add Track
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-zinc-900 border-zinc-700'>
        <DialogHeader>
          <DialogTitle>Add New Track</DialogTitle>
          <DialogDescription>Add a new track to your library</DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-4'>
          <input
            type='file'
            accept='audio/*'
            onChange={(e) =>
              setFile((prev) => ({ ...prev, audio: e.target.files![0] }))
            }
            ref={audioRef}
            hidden
          />
        </div>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Audio file</label>
          <div className='flex items-center gap-2'>
            <Button
              className='w-full'
              variant={'outline'}
              onClick={() => audioRef.current?.click()}
            >
              {file.audio ? file.audio.name.slice(0, 20) : 'Choose Audio File'}
            </Button>
          </div>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium'>Track ID</label>
          <Input
            value={track.trackId!}
            onChange={(e) => setTrack({ ...track, trackId: e.target.value })}
            className='bg-zinc-800 border-zinc-700'
            placeholder='Enter track ID'
          />
        </div>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Track Duration</label>
          <Input
            value={track.duration!}
            onChange={(e) => setTrack({ ...track, duration: e.target.value })}
            className='bg-zinc-800 border-zinc-700'
            placeholder='Enter track duration'
          />
        </div>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Album ID</label>
          <Select
            value={track.albumId!}
            onValueChange={(value) => setTrack({ ...track, albumId: value })}
          >
            <SelectTrigger className='bg-zinc-800 border-zinc-700'>
              <SelectValue placeholder='Select Album' />
            </SelectTrigger>
            <SelectContent className='bg-zinc-800 border-zinc-700'>
              {albums.length === 0 && (
                <SelectItem value='none'>No album (Single)</SelectItem>
              )}
              {albums.map((album) => (
                <SelectItem value={String(album._id)} key={album._id}>
                  {album.data.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => setAlbumDialogOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            type='submit'
            disabled={loading || !track.albumId || !track.trackId}
            className='bg-emerald-500 hover:bg-emerald-600'
          >
            {loading ? 'Uploading...' : 'Upload Track'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
