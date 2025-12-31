import { Skeleton } from '@/components/ui/skeleton';

export const AlbumPageSkeleton = () => {
  return (
    <div className='relative min-h-screen overflow-hidden'>
      {/* background overlay */}
      <div className='absolute inset-0 bg-linear-to-b from-zinc-800/60 via-zinc-900/80 to-zinc-900 pointer-events-none rounded-md' />

      <div className='relative z-10'>
        {/* Header */}
        <div className='flex p-6 gap-6 pb-8'>
          {/* Album cover */}
          <Skeleton className='h-[230px] w-[230px] rounded-md' />

          <div className='flex flex-col justify-end flex-1'>
            <Skeleton className='h-4 w-20 mb-2' />

            {/* Album title */}
            <Skeleton className='h-16 w-[70%] mb-4' />

            {/* Meta row */}
            <div className='flex items-center gap-2'>
              <Skeleton className='h-8 w-8 rounded-full' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-20' />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className='px-6 pb-4 flex items-center justify-between'>
          <Skeleton className='h-14 w-14 rounded-full' />
          <Skeleton className='h-10 w-[300px] rounded-2xl' />
        </div>

        {/* Table header */}
        <div className='bg-black/20 backdrop-blur-sm'>
          <div className='grid grid-cols-[16px_4fr_2fr_1fr_1fr] gap-4 px-10 py-2 border-b border-white/5'>
            <Skeleton className='h-4 w-4' />
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-4 w-10' />
            <Skeleton className='h-4 w-8' />
          </div>

          {/* Track rows */}
          <div className='px-6 py-4 space-y-3'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className='grid grid-cols-[16px_4fr_2fr_1fr_1fr] gap-4 px-4 py-2 rounded-md'
              >
                <Skeleton className='h-4 w-4' />

                <div className='flex items-center gap-3'>
                  <Skeleton className='h-10 w-10 rounded-sm' />
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-40' />
                    <Skeleton className='h-3 w-28' />
                  </div>
                </div>

                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-10' />
                <Skeleton className='h-6 w-6 rounded-full' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
