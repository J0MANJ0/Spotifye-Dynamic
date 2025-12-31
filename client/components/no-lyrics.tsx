'use client';

import { useEffect, useState } from 'react';

export const NoLyrics = ({ trackId }: { trackId: number }) => {
  const [idx, setIdx] = useState(0);
  const messages = [
    "You'll have to guess the lyrics for this one.",
    "Hmm. We don't know the lyrics for this one.",
    "You caught us,we're still working on getting lyrics for this one.",
    "Looks like we don't have the lyrics for this song.",
  ];

  useEffect(() => {
    setIdx(Math.floor(Math.random() * messages.length));
  }, [trackId, messages.length]);

  return (
    <div className='w-full h-full flex flex-col justify-center items-center text-center px-5 rounded-md bg-zinc-600 relative'>
      <div>
        <h2 className='font-bold text-5xl wrap-break-word'>{messages[idx]}</h2>
      </div>
      <div className='h-[90px] w-full p-2 bg-zinc-900 absolute bottom-0 rounded-b-md' />
    </div>
  );
};
