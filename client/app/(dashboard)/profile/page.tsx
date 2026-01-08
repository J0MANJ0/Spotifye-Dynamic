'use client';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { useNavigationHistory } from '@/hooks/use-nav';
import { useFollowStore } from '@/stores/use-follow-store';
import { MoreHorizontal } from 'lucide-react';
import { FollowArtistCard } from '@/components/follow-artist-card';
import { useChartStore } from '@/stores/use-chart-store';
import { FollowArtistTop } from '@/components/follow-artist-top-card';

const ProfilePage = () => {
  const { router } = useNavigationHistory();
  const { followedArtists, FollowArtist, unFollowArtist, getTargets } =
    useFollowStore();
  const { artists } = useChartStore();

  const followed = useMemo(() => {
    const filterd = followedArtists;
    return filterd?.sort(() => Math.random() - 0.5).slice(0, 6);
  }, [followedArtists]);

  const topArtists = useMemo(() => {
    const filterd = artists;
    return filterd.sort(() => Math.random() - 0.5).slice(0, 5);
  }, [artists]);

  const { user } = useUser();

  useEffect(() => {
    getTargets('artists');
  }, [FollowArtist, unFollowArtist, getTargets]);

  return (
    <ScrollArea className='h-full rounded-md bg-zinc-700/30'>
      <div
        className='absolute inset-0 bg-linear-to-b via-zinc-900/80 to-zinc-900 pointer-events-none'
        aria-hidden='true'
        style={{
          backgroundImage: `linear-gradient(to bottom, ${`#d90429`}60, rgba(24,24,27,0.8), rgba(24,24,27,1))`,
        }}
      />
      <div className='min-h-full relative'>
        <div className='relative z-10'>
          <div className='flex p-6 gap-6 pb-8'>
            <img
              src={user?.imageUrl}
              alt='liked-songs'
              className='size-60 shadow-xl rounded-full'
            />
            <div className='flex flex-col justify-end'>
              <p className='text-sm font-medium text-gray-300'>Profile</p>
              <motion.h2
                className='text-7xl font-extrabold my-4'
                initial={{ opacity: 0, y: -25, color: '#000' }}
                animate={{ opacity: 1, y: 0, color: '#fff' }}
                transition={{ duration: 0.7 }}
                translate='yes'
              >
                {user?.fullName}
              </motion.h2>
              <div className='flex items-center gap-2 text-sm text-gray-200'>
                <span className='font-medium'>
                  <span className='text-muted-foreground'>
                    5 public playlists
                  </span>{' '}
                  •{' '}
                  <span
                    className='hover:underline cursor-pointer'
                    onClick={() => router.push('/following-artists')}
                  >
                    {followedArtists && followedArtists.length} following
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className='bg-black/20 flex flex-col flex-1'>
            <div className='px-6 pb-4 flex items-center justify-between gap-6'>
              <div className='flex justify-between items-center gap-5'>
                <button
                  // onClick={handlePlayAlbum}
                  className='size-14 rounded-full hover:scale-[1.030] transition-all flex justify-center items-center'
                >
                  <MoreHorizontal className='text-muted-foreground h-7 w-7' />
                </button>
              </div>
            </div>
            {topArtists?.length! > 0 && (
              <div className='flex flex-col p-4'>
                <div className='w-full flex justify-between items-center px-8'>
                  <div>
                    <h2
                      className='font-bold text-2xl hover:underline cursor-pointer'
                      onClick={() => router.push('/top-artists')}
                    >
                      Top artists this month
                    </h2>
                  </div>
                  <div>
                    <span
                      className='text-sm font-semibold text-gray-400 cursor-pointer hover:underline'
                      onClick={() => router.push('/top-artists')}
                    >
                      Show all
                    </span>
                  </div>
                </div>
                <div className='grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 w-full'>
                  {topArtists?.slice(0, 5).map((artist, i) => (
                    <FollowArtistTop key={i} artist={artist} />
                  ))}
                </div>
              </div>
            )}
            {followed?.length! > 0 && (
              <div className='flex flex-col p-4'>
                <div className='w-full flex justify-between items-center px-8'>
                  <div>
                    <h2
                      className='font-bold text-2xl hover:underline cursor-pointer'
                      onClick={() => router.push('/following-artists')}
                    >
                      Following
                    </h2>
                  </div>
                  <div>
                    <span
                      className='text-sm font-semibold text-gray-400 cursor-pointer hover:underline'
                      onClick={() => router.push('/following-artists')}
                    >
                      Show all
                    </span>
                  </div>
                </div>
                <div className='grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-4 w-full'>
                  {followed?.map((artist, i) => (
                    <FollowArtistCard key={i} artist={artist} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ScrollBar orientation='vertical' />
    </ScrollArea>
  );
};
export default ProfilePage;
