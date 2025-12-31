'use client';

import { useMusicStore } from '@/stores/use-music-store';
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
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface Lrc {
  trackId: string;
  lyrics: string;
}

export const AddLyricsDialog = () => {
  const { createLrc, loadingLrc: loading } = useMusicStore();
  const [lrc, setLrc] = useState<Lrc>({
    trackId: '',
    lyrics: '',
  });
  const [lyricsDialogOpen, setLyricsDialogOpen] = useState(false);

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append('trackId', lrc.trackId);
    formData.append('lyrics', lrc.lyrics);

    await createLrc(formData);

    setLrc({ trackId: '', lyrics: '' });
    setLyricsDialogOpen(false);
  };

  useEffect(() => {
    if (!lyricsDialogOpen) {
      setLrc({ trackId: '', lyrics: '' });
    }
  }, [lyricsDialogOpen]);

  return (
    <Dialog open={lyricsDialogOpen} onOpenChange={setLyricsDialogOpen}>
      <DialogTrigger asChild>
        <Button className='bg-green-500 hover:bg-green-600 text-white'>
          <Plus className='h-4 w-4 mr-2' />
          Add Lyrics
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-zinc-900 border-zinc-700'>
        <DialogHeader>
          <DialogTitle>Add Lyrics</DialogTitle>
          <DialogDescription>
            Add a new lyrics to your collection
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Track ID</label>
          <Input
            value={lrc.trackId!}
            onChange={(e) =>
              setLrc((prev) => ({ ...prev, trackId: e.target.value }))
            }
            className='bg-zinc-800 border-zinc-700'
            placeholder='Enter track ID'
          />
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium'>Lyrics</label>
          <Textarea
            placeholder='paste your lyrics here'
            value={lrc.lyrics}
            onChange={(e) =>
              setLrc((prev) => ({ ...prev, lyrics: e.target.value }))
            }
          />
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => setLyricsDialogOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            type='submit'
            disabled={loading || !lrc.lyrics || !lrc.trackId}
            className='bg-green-500 hover:bg-green-600'
          >
            {loading ? 'Uploading...' : 'Upload Lyrics'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
