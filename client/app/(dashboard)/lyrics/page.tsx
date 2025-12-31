'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { bgGradientLyrics, cn } from '@/lib/utils';
import { usePlayerStore } from '@/stores/use-player-store';
import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { NoLyrics } from '@/components/no-lyrics';
import { motion } from 'framer-motion';
import { useMusicStore } from '@/stores/use-music-store';
import { AudioLines, Loader } from 'lucide-react';
import { useNavigationHistory } from '@/hooks/use-nav';

type Gradient = {
  bg: string;
  activeText: string;
  lessText: string;
  greaterText: string;
};

const LyricsPage = () => {
  const { currentTrack, currentTime, seekTo } = usePlayerStore();
  const { lrcLyrics, fetchLrc, loadingLrc: loading } = useMusicStore();
  const { router } = useNavigationHistory();

  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const [showSyncBtn, setShowSyncBtn] = useState(false);
  const [gradient, setGradient] = useState<Gradient>({
    bg: '',
    activeText: '',
    lessText: '',
    greaterText: '',
  });

  useEffect(() => {
    if (!currentTrack) return;
    fetchLrc(currentTrack?.trackId);
  }, [currentTrack?.trackId, fetchLrc]);

  const activeIndex = lrcLyrics.findIndex(
    (line, i) =>
      currentTime >= line.time &&
      currentTime < (lrcLyrics[i + 1]?.time ?? Infinity)
  );

  useEffect(() => {
    setGradient(bgGradientLyrics());
  }, [currentTrack?.trackId]);

  const syncToActiveLine = useCallback(() => {
    activeLineRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, []);

  useEffect(() => {
    if (activeIndex === -1 || !scrollAreaRef.current || !activeLineRef.current)
      return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowSyncBtn(!entry.isIntersecting);
      },
      { root: scrollAreaRef.current, threshold: 0.5 }
    );

    if (activeLineRef.current) {
      observer.observe(activeLineRef.current);
    }

    return () => observer.disconnect();
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === -1 || !activeLineRef.current) return;

    const timeoutId = setTimeout(() => {
      activeLineRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      setShowSyncBtn(false);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (activeIndex !== -1) {
      activeLineRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTrack?.trackId]);

  useEffect(() => {
    if (!showSyncBtn)
      activeLineRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
  }, [activeIndex, currentTrack?.trackId, showSyncBtn]);

  if (!currentTrack) {
    return (
      <div className='w-full h-full rounded-md bg-accent flex justify-center items-center text-center'>
        <motion.h2
          className='text-muted-foreground text-5xl font-bold wrap-break-word'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Please choose a song to display lyrics!
        </motion.h2>
      </div>
    );
  }
  if (loading) {
    return (
      <div className='w-full h-full bg-zinc-900 flex justify-center items-center text-center mx-auto'>
        <div>
          <Loader className='h-10 w-10 text-muted-foreground animate-spin' />
        </div>
      </div>
    );
  }
  if (!lrcLyrics.length) {
    return <NoLyrics trackId={currentTrack.trackId} />;
  }

  return (
    <div
      className='h-full p-6 rounded-md relative'
      style={{ backgroundColor: gradient.bg }}
    >
      <ScrollArea className='h-full' ref={scrollAreaRef}>
        <div className='flex flex-col gap-6 justify-start px-6'>
          {lrcLyrics.map((line, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: i === activeIndex ? 0.9 : 1,
              }}
              animate={{
                opacity: i === activeIndex ? 1 : 0.9,
              }}
              exit={{ opacity: 0 }}
            >
              <span
                ref={i === activeIndex ? activeLineRef : null}
                className={cn(
                  'hover:text-white hover:opacity-100 hover:underline cursor-pointer text-wrap text-4xl font-bold',
                  i === activeIndex && 'text-5xl',
                  i === activeIndex
                    ? 'opacity-100'
                    : i < activeIndex
                    ? 'opacity-50'
                    : 'opacity-80'
                )}
                onClick={() => seekTo(line.time)}
                style={{
                  color:
                    i === activeIndex
                      ? gradient.activeText
                      : i < activeIndex
                      ? gradient.lessText
                      : gradient.greaterText,
                }}
              >
                {line.text}
              </span>
            </motion.div>
          ))}
        </div>

        <div
          className='flex items-center justify-start mr-6 mt-5'
          style={{ color: `${gradient.activeText}80` }}
        >
          <div className='flex flex-col'>
            <div
              onClick={() =>
                router.push(`/albums/${currentTrack.data.album.id}`)
              }
              style={{ color: gradient.lessText, opacity: 0.7 }}
            >
              Track:
              <span className='cursor-pointer hover:underline'>
                {currentTrack.data.title}
              </span>
            </div>
            <div style={{ color: gradient.lessText, opacity: 0.7 }}>
              Artist(s):{' '}
              {currentTrack.data.contributors.map((c, i) => (
                <span
                  key={c.id}
                  onClick={() => router.push(`/artists/${c.id}`)}
                  className='hover:underline cursor-pointer'
                >
                  {c.name}
                  {i !== currentTrack.data.contributors.length - 1 && ','}
                </span>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {showSyncBtn && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={syncToActiveLine}
          className='absolute bottom-10 left-1/2 -translate-x-1/2 px-8 flex justify-center items-center py-2 gap-3 rounded-full bg-white text-black font-semibold shadow-lg hover:scale-105 transition cursor-pointer'
        >
          <AudioLines className='h-5 w-5 animate-pulse' />
          Sync
        </motion.button>
      )}
    </div>
  );
};

export default LyricsPage;
