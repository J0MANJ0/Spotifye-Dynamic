'use client';

import { Header } from '@/components/admin-header';
import { AlbumsTabs } from '@/components/albums-tab';
import { LyricsTabs } from '@/components/lyrics-tabs';
import { Offline } from '@/components/offline';
import { DashboardStats } from '@/components/stats';
import { TrackTabs } from '@/components/track-tabs';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOnlineStatus } from '@/hooks/use-online';
import { useMusicStore } from '@/stores/use-music-store';
import { Library, Mic2, Music, RefreshCcw } from 'lucide-react';
import { useEffect } from 'react';

const AdminPage = () => {
  const { fetchStats, fetchAlbums, fetchTracks, loadingStats } =
    useMusicStore();

  const isOnline = useOnlineStatus();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return isOnline ? (
    <div className='min-h-screen bg-inherit text-zinc-100 p-8'>
      <Header />
      <DashboardStats />
      <div className='flex justify-end items-center mb-6'>
        <Button
          variant={'outline'}
          className='rounded-full h-10 w-10'
          onClick={() => {
            fetchStats(), fetchAlbums(), fetchTracks();
          }}
        >
          <RefreshCcw
            className={`h-4 w-4 text-muted-foreground ${
              loadingStats && 'animate-spin text-white'
            }`}
          />
        </Button>
      </div>
      <Tabs defaultValue='tracks' className='space-y-6'>
        <TabsList className='p-1 bg-zinc-800 gap-2'>
          <TabsTrigger
            value='tracks'
            className='data-[state=active]:bg-zinc-700'
          >
            <Music className='mr-2 h-4 w-4' />
            Tracks
          </TabsTrigger>

          <TabsTrigger
            value='albums'
            className='data-[state=active]:bg-zinc-700'
          >
            <Library className='mr-2 h-4 w-4' />
            Albums
          </TabsTrigger>
          <TabsTrigger
            value='lyrics'
            className='data-[state=active]:bg-zinc-700'
          >
            <Mic2 className='mr-2 h-4 w-4' />
            Lyrics
          </TabsTrigger>
        </TabsList>
        <TabsContent value='tracks'>
          <TrackTabs />
        </TabsContent>

        <TabsContent value='albums'>
          <AlbumsTabs />
        </TabsContent>

        <TabsContent value='lyrics'>
          <LyricsTabs />
        </TabsContent>
      </Tabs>
    </div>
  ) : (
    <div className='w-full h-full'>
      <Offline />
    </div>
  );
};

export default AdminPage;
