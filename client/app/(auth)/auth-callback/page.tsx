'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useNavigationHistory } from '@/hooks/use-nav';
import { api } from '@/lib/api';
import { useUser } from '@clerk/nextjs';
import { Loader } from 'lucide-react';
import { useEffect, useRef } from 'react';

const AuthCallbackPage = () => {
  const { isLoaded, user } = useUser();
  const { router } = useNavigationHistory();

  const syncAttempt = useRef(false);

  useEffect(() => {
    const syncUser = async () => {
      if (!user || !isLoaded || syncAttempt.current) return;

      try {
        syncAttempt.current = true;

        await api.post('/auth/callback', {
          clerkId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        });
      } catch (error: any) {
        console.log(`Error in auth callback ${error}`);
      } finally {
        router.push('/');
      }
    };

    syncUser();
  }, [isLoaded, user, router]);

  return (
    <div className='min-h-screen w-full bg-black flex items-center justify-center'>
      <Card className='w-[90%] max-w-md bg-zinc-900 border-zinc-800'>
        <CardContent className='flex flex-col items-center gap-4 pt-6'>
          <Loader className='h-6 w-6 text-emerald-500 animate-spin' />
          <h3 className='text-zinc-400 text-xl font-bold'>Logging you in</h3>
          <p className='text-zinc-400 text-sm'>Redirecting...</p>
        </CardContent>
      </Card>
    </div>
  );
};
export default AuthCallbackPage;
