'use client';

import { FeaturedSection } from '@/components/featured-section';
import { SectionGrid } from '@/components/section-grid';
import { Topbar } from '@/components/top-bar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getGreetings } from '@/lib/utils';

import { useMusicStore } from '@/stores/use-music-store';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

const Home = () => {
  const { user } = useUser();

  const [greeting, setGreeting] = useState('');
  const { madeforyou, loadingMadeForYou: loading } = useMusicStore();

  useEffect(() => {
    const getGreeting = async () => {
      const g = await getGreetings(user?.fullName || '');
      setGreeting(g);
    };
    getGreeting();
  }, [greeting, user?.fullName]);

  return (
    <main className='rounded-md h-full bg-linear-to-b from-zinc-800 to-zinc-900'>
      <Topbar />
      <ScrollArea className='h-[calc(100vh-270px)]'>
        <div className='sm:p-6 p-4'>
          <h1 className='text-2xl sm:text-3xl font-bold mb-6'>{greeting}</h1>
          <FeaturedSection />

          <div className='space-y-8'>
            {madeforyou.length > 0 && (
              <SectionGrid
                title={'Made for'}
                subTitle={user?.fullName!}
                tracks={madeforyou.slice(0, 8)}
                href='/for-you'
                loading={loading}
              />
            )}
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};
export default Home;
