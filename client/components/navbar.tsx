'use client';

import { SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { Tooltip } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigationHistory } from '@/hooks/use-nav';
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { Input } from './ui/input';
import { Heart, Search, Settings, User } from 'lucide-react';
import { useAuthStore } from '@/stores/use-auth-store';
import Link from 'next/link';
import { SignInOauthBtn } from './sign-in-oauth-btn';
import { Badge } from './ui/badge';
import GradientButton from './kokonutui/gradient-button';
import { useChatStore } from '@/stores/use-chat-store';
import { usePlayerStore } from '@/stores/use-player-store';

export const Navbar = () => {
  const { user } = useUser();
  const { isAdmin } = useAuthStore();
  const { messages } = useChatStore();
  const { canGoBack, canGoForward, goBack, goForward, pathname, router } =
    useNavigationHistory();
  const { isActive } = usePlayerStore();

  const unseenMessages = messages.filter((m) => !m.seen);

  return (
    <nav className='h-10 bg-black p-4 my-2 flex justify-between items-center'>
      <div className='flex justify-center items-center gap-2 ml-8'>
        <Tooltip placement='bottom' title={canGoBack ? 'Go Back' : ''}>
          <button
            onClick={() => {
              if (canGoBack) {
                goBack();
              }
            }}
            className={`${
              canGoBack
                ? 'hover:bg-zinc-700 rounded-full'
                : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!canGoBack}
          >
            <KeyboardArrowLeftIcon fontSize='large' />
          </button>
        </Tooltip>
        <Tooltip placement='bottom' title={canGoForward ? 'Go Forward' : ''}>
          <button
            onClick={() => {
              if (canGoForward) {
                goForward();
              }
            }}
            className={`${
              canGoForward
                ? 'hover:bg-zinc-700 rounded-full'
                : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!canGoForward}
          >
            <KeyboardArrowRightIcon fontSize='large' />
          </button>
        </Tooltip>
      </div>

      <div className='flex items-center justify-between gap-2'>
        <Tooltip placement='bottom' title='Home'>
          <div
            className='bg-zinc-800 rounded-full p-2 flex justify-center items-center cursor-pointer hover:scale-[1.030] hover:bg-zinc-700'
            onClick={() => router.push('/')}
          >
            {pathname === '/' ? (
              <HomeIcon />
            ) : (
              <HomeOutlinedIcon sx={{ color: '#ccc' }} />
            )}
          </div>
        </Tooltip>

        <div className='relative'>
          <Input
            placeholder='What do you want to listen?'
            className='px-8 py-4 rounded-3xl bg-zinc-800 w-[350px]'
          />
          <Search className='size-4 absolute left-2 top-2.5' />
        </div>
      </div>

      <div className='p-1.5 flex justify-center items-center'>
        <div className='flex gap-4 items-center'>
          {isAdmin && (
            <Link href={'/admin'}>
              <GradientButton label='Admin Dashboard' icon={User} />
            </Link>
          )}

          {user && (
            <div className='flex justify-between items-center gap-5'>
              <Tooltip placement='bottom' title='Messages'>
                <div
                  className='relative cursor-pointer'
                  onClick={() => router.push('/chat')}
                >
                  <NotificationsOutlinedIcon
                    fontSize='small'
                    sx={{ color: '#ccc' }}
                  />
                  {unseenMessages.length > 0 && (
                    <Badge className='absolute right-0 size-2 rounded-full bg-green-500 hover:bg-green-400'>
                      {unseenMessages.length}
                    </Badge>
                  )}
                </div>
              </Tooltip>
              <Tooltip placement='bottom' title={`${user?.fullName}`}>
                <div className='bg-zinc-700 flex justify-center items-center p-1 rounded-full'>
                  <UserButton>
                    <UserButton.MenuItems>
                      <UserButton.Action
                        label='Liked Songs'
                        labelIcon={<Heart className='size-4 text-zinc-900' />}
                        onClick={() => router.push('/liked-songs')}
                      />
                    </UserButton.MenuItems>
                    <UserButton.MenuItems>
                      <UserButton.Action
                        label='Profile'
                        labelIcon={<User className='size-4 text-zinc-900' />}
                        onClick={() => router.push('/profile')}
                      />
                    </UserButton.MenuItems>
                    <UserButton.MenuItems>
                      <UserButton.Action
                        label='Settings'
                        labelIcon={
                          <Settings className='size-4 text-zinc-900' />
                        }
                        onClick={() => router.push('/settings')}
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                </div>
              </Tooltip>
            </div>
          )}

          <SignedOut>
            <SignInOauthBtn />
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};
