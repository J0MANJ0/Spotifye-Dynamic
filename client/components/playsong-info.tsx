import { useNavigationHistory } from '@/hooks/use-nav';
import { ToggleLikeSong } from './toggle-like';
import { usePlayerStore } from '@/stores/use-player-store';
import { useUser } from '@clerk/nextjs';
import { useMusicStore } from '@/stores/use-music-store';

export const PlaySongInfo = () => {
  const { user } = useUser();
  const { currentTrackId } = usePlayerStore();
  const { router } = useNavigationHistory();

  const currentTrack = useMusicStore((s) => s.tracksByIds[currentTrackId!]);

  return (
    <div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]'>
      {currentTrack && (
        <>
          <img
            src={currentTrack.data.album.cover_small}
            alt={''}
            className='w-14 h-14 object-cover rounded-md cursor-pointer'
            onClick={() =>
              usePlayerStore.setState((state) => ({
                isMaxLeft: !state.isMaxLeft,
              }))
            }
          />
          <div className='flex-1 min-w-0'>
            <div>
              <div className='font-medium truncate flex gap-12 items-center group'>
                <span
                  className='hover:underline cursor-pointer'
                  onClick={() =>
                    router.push(`/albums/${currentTrack.data.album.id}`)
                  }
                >
                  {currentTrack.data.title}
                </span>

                {user && (
                  <span>
                    <ToggleLikeSong trackId={String(currentTrack.trackId)} />
                  </span>
                )}
              </div>
            </div>
            <div className='text-sm text-zinc-400 truncate'>
              {currentTrack.data.contributors.map((c, i) => (
                <span
                  key={c.id}
                  className='hover:underline cursor-pointer text-xs font-mono'
                  onClick={() => router.push(`/artists/${c.id}`)}
                >
                  {c.name}
                  {i !== currentTrack.data.contributors.length - 1 && ','}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
