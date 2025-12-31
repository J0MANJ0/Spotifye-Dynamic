export const Topbar = () => {
  return (
    <div className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10 rounded-t-md'>
      <div className='flex gap-2 items-center'>
        <img src='/spotify.png' alt='spotifye logo' className='size-8' />
        <h3 className='font-semibold text-gray-200 text-xl hover:text-white'>
          Spotifye
        </h3>
      </div>
    </div>
  );
};
