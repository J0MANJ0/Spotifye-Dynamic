'use client';

import { Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HomeIcon from '@mui/icons-material/Home';
import { Tooltip } from '@mui/material';
import { useNavigationHistory } from '@/hooks/use-nav';

function NotFoundPage() {
  const { router } = useNavigationHistory();

  return (
    <div className='h-screen bg-neutral-900 flex items-center justify-center'>
      <div className='text-center space-y-8 px-4'>
        {/* Large animated musical note */}
        <div className='flex justify-center animate-bounce'>
          <Music2 className='h-24 w-24 text-emerald-500' />
        </div>

        {/* Error message */}
        <div className='space-y-4'>
          <h1 className='text-7xl font-bold text-white'>404</h1>
          <h2 className='text-2xl font-semibold text-white'>Page not found</h2>
          <p className='text-neutral-400 max-w-md mx-auto'>
            Looks like this track got lost in the shuffle. Let&#39;s get you
            back to the music.
          </p>
        </div>

        {/* Action buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mt-8'>
          <Tooltip placement='left' title='Back'>
            <Button
              onClick={() => router.back()}
              variant='outline'
              className='bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700 w-full sm:w-auto'
            >
              Go Back
            </Button>
          </Tooltip>
          <Tooltip placement='right' title='Home'>
            <Button
              onClick={() => router.push('/')}
              className='bg-emerald-500 hover:bg-emerald-600 text-white w-full sm:w-auto'
            >
              <HomeIcon fontSize='medium' />
              Back to Home
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
