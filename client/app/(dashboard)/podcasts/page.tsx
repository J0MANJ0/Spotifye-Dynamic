'use client';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useNavigationHistory } from '@/hooks/use-nav';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useChartStore } from '@/stores/use-chart-store';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Clock, Pause, Play } from 'lucide-react';

const PodcastsPage = () => {
  const { user } = useUser();
  const { router } = useNavigationHistory();
  const { podcasts } = useChartStore();
  return (
    <ScrollArea className='w-full h-full rounded-md bg-zinc-900'>
      <div
        className='absolute inset-0  pointer-events-none'
        aria-hidden='true'
        style={{
          backgroundImage: `linear-gradient(to bottom, ${`#2b9348`}, rgba(24,24,27,0.8), rgba(24,24,27,1))`,
        }}
      />
      <div className='relative z-10'>
        <div className='flex p-6 gap-6 pb-8'>
          <div className='size-60 rounded-md flex justify-center items-center bg-green-400/40'>
            <BookmarkIcon sx={{ color: '#aacc00', fontSize: '80px' }} />
          </div>
          <div className='flex flex-col justify-end'>
            <p className='text-sm font-medium text-gray-300'>Playlist</p>
            <motion.h2
              className='text-8xl font-extrabold my-4'
              initial={{ opacity: 0, y: -25, color: '#000' }}
              animate={{ opacity: 1, y: 0, color: '#fff' }}
              transition={{ duration: 0.7 }}
              translate='yes'
            >
              Your Episodes
            </motion.h2>
            <div className='flex items-center gap-1 text-sm text-gray-400'>
              <img
                src={user?.imageUrl}
                alt={user?.fullName ?? 'user'}
                className='size-6 rounded-full object-cover'
              />

              <span
                className='font-bold text-white hover:underline cursor-pointer'
                onClick={() => router.push('/profile')}
              >
                {user?.fullName}
              </span>
              <span className='font-mono'>
                • {podcasts && podcasts.length}{' '}
                {podcasts && podcasts.length === 1 ? 'episode' : 'episodes'}
              </span>
            </div>
          </div>
        </div>

        <div className='px-6 pb-4 flex items-center justify-between gap-6'>
          <div className='flex justify-between items-center gap-5'>
            <button
              // onClick={handlePlayAlbum}
              className='size-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-[1.030] transition-all flex justify-center items-center'
              disabled={!podcasts?.length}
              style={{
                cursor: !podcasts?.length ? 'not-allowed' : 'pointer',
                opacity: !podcasts?.length ? 0.5 : 1,
              }}
            >
              {podcasts ? <Pause /> : <Play />}
            </button>
          </div>
        </div>

        <div className='bg-inherit flex flex-col p-4'>
          <div>
            <div className='grid grid-cols-[16px_5fr_3fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5'>
              <div>#</div>
              <div></div>
              <div>Title</div>
            </div>
          </div>
          <div className=''>
            <div className='space-y-2 py-4'>
              {podcasts?.map((pod, i) => (
                <div
                  className='grid grid-cols-[16px_5fr_3fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5'
                  key={pod.id}
                >
                  <span className='flex justify-center items-center font-mono'>
                    {i + 1}
                  </span>
                  <div className='flex items-center gap-3'>
                    <a href={pod.link} target='_blank'>
                      <img
                        src={pod.picture_medium}
                        alt=''
                        className='size-20 rounded-[3px]'
                      />
                    </a>
                  </div>
                  <div className='flex justify-start items-center'>
                    <a
                      href={pod.link}
                      target='_blank'
                      className='text-white font-semibold hover:underline'
                    >
                      {pod.title}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ScrollBar orientation='vertical' />
    </ScrollArea>
  );
};
export default PodcastsPage;
