'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import ExplicitIcon from '@mui/icons-material/Explicit';
import { useAuthStore } from '@/stores/use-auth-store';
import { redirect } from 'next/navigation';
import { EditProfileDialog } from '@/components/edit-profile-dialog';

const SettingsPage = () => {
  const { explicitContent, toggleExplicitContent, loadingExplicit, user } =
    useAuthStore();

  if (!user) redirect('/');

  return (
    <div className='h-full w-full bg-zinc-900 px-10 rounded-md'>
      <div className='flex justify-cente h-full w-[75%] mx-auto p-4'>
        <ScrollArea className='h-full w-full flex flex-col mt-5 p-4'>
          <div className='flex justify-start items-center'>
            <div>
              <h1 className='text-3xl font-bold'>Settings</h1>
            </div>
          </div>
          <div className='flex flex-col mt-10 p-2'>
            <div className='flex justify-start'>
              <h3 className='text-md font-semibold'>Account</h3>
            </div>
            <div className='flex justify-between items-center'>
              <div>
                <p className='text-xs text-muted-foreground'>
                  Edit your username
                </p>
              </div>
              <div>
                <EditProfileDialog />
              </div>
            </div>
          </div>
          <div className='flex flex-col mt-10 px-2'>
            <div className='flex justify-start'>
              <h3 className='text-md font-semibold'>Explicit content</h3>
            </div>
            <div className='flex justify-between items-center'>
              <div className='flex flex-col justify-start'>
                <p className='text-sm text-muted-foreground'>
                  Allow explicit content
                </p>
                <p className='text-xs text-muted-foreground'>
                  Explicit content (labeled with the{' '}
                  <ExplicitIcon fontSize='small' sx={{ color: '#ccc' }} />) is
                  playable
                </p>
                <p className='text-xs text-muted-foreground'>
                  When off,explicit music is skipped
                </p>
              </div>
              <div className='flex justify-start'>
                <Switch
                  onClick={() => toggleExplicitContent()}
                  checked={explicitContent}
                  disabled={loadingExplicit}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
export default SettingsPage;
