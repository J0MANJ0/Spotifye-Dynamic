'use client';

import { useMusicStore } from '@/stores/use-music-store';
import { useState } from 'react';
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

export const AddAlbumDialog = () => {
  const { createAlbum, loadingAlbum: loading } = useMusicStore();
  const [albumId, setAlbumId] = useState<number | null>();
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);

  const handleSubmit = () => {
    createAlbum(albumId!);
    setAlbumId(null);
  };
  return (
    <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
      <DialogTrigger asChild>
        <Button className='bg-violet-500 hover:bg-violet-600 text-white'>
          <Plus className='h-4 w-4 mr-2' />
          Add Album
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-zinc-900 border-zinc-700'>
        <DialogHeader>
          <DialogTitle>Add New Album</DialogTitle>
          <DialogDescription>
            Add a new album to your collection
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Album ID</label>
          <Input
            value={albumId!}
            onChange={(e) => setAlbumId(Number(e.target.value))}
            className='bg-zinc-800 border-zinc-700'
            placeholder='Enter album title'
          />
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
            disabled={
              loading ||
              !String(albumId).trim() ||
              String(albumId) === '0' ||
              !albumId
            }
            className='bg-violet-500 hover:bg-violet-600'
          >
            {loading ? 'Uploading...' : 'Upload Album'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
