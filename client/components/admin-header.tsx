import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export const Header = () => {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-3 mb-8'>
        <Link href='/' className='rounded-lg'>
          <img src='/spotify.png' alt='logo' className='size-10' />
        </Link>
        <div>
          <h1 className='text-3xl font-bold text-gray-200 hover:text-white'>
            Music Manager
          </h1>
          <p className='text-zinc-400 mt-1'>Manage your music catalog</p>
        </div>
      </div>
      <UserButton />
    </div>
  );
};
