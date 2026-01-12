'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './ui/resizable';
import React, { useEffect, useState } from 'react';
import { Navbar } from './navbar';
import { PlaybackControls } from './playback-controls';
import { LeftSidebar } from './left-sidebar';
import { AudioPlayer } from '@/hooks/use-audio';
import { useMusicStore } from '@/stores/use-music-store';
import { UsersActivities } from './users-activities';
import { Queue } from './queue';
import { LiveTrack } from './live-track';
import { usePlayerStore } from '@/stores/use-player-store';
import { useOnlineStatus } from '@/hooks/use-online';
import { Offline } from './offline';
import { ShowActiveDevice } from './show-active';
import { DevicePicker } from './device-picker';
import { SidebarProvider } from './ui/sidebar';
import { RightSidebar } from './right-sidebar';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: Props) => {
  const { selectedstate } = useMusicStore();
  const { isMaxRight, isMaxLeft } = usePlayerStore();
  const [maxRight, setisMaxRight] = useState<boolean>(true);
  const [maxLeft, setisMaxLeft] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState(false);

  const { user } = useUser();

  const isOnline = useOnlineStatus();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setisMaxRight(isMaxRight);
  }, [isMaxRight]);

  useEffect(() => {
    setisMaxLeft(isMaxLeft);
  }, [isMaxLeft]);

  // if (!user) redirect('/auth/sign-in');
  return (
    <AnimatePresence>
      <motion.div
        key={'fullPlayer'}
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.9 }}
      >
        {isOnline ? (
          <div className='h-screen bg-black flex flex-col select-none'>
            <Navbar />
            <ResizablePanelGroup
              direction='horizontal'
              className='flex flex-1 h-full overflow-hidden p-2'
            >
              <AudioPlayer />
              <ResizablePanel
                defaultSize={20}
                minSize={0}
                maxSize={20}
                collapsedSize={0}
              >
                <LeftSidebar />
              </ResizablePanel>
              <ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />
              <ResizablePanel defaultSize={isMobile ? 80 : 60}>
                {children}
              </ResizablePanel>

              <ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

              {!isMobile && (
                <>
                  <ResizablePanel
                    defaultSize={20}
                    minSize={!maxRight ? 0 : 20}
                    maxSize={maxRight ? 20 : 0}
                    collapsedSize={0}
                  >
                    <RightSidebar />
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
            <PlaybackControls />
            <ShowActiveDevice />
          </div>
        ) : (
          <Offline />
        )}
      </motion.div>
    </AnimatePresence>
  );
};
