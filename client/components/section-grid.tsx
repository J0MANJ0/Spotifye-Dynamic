import { Track } from '@/types';
import { SectionGridSkeleton } from './section-grid-skeleton';
import { useNavigationHistory } from '@/hooks/use-nav';
import { PlayBtn } from './play-btn';
import { Button } from './ui/button';

type Props = {
  title: string;
  subTitle?: string;
  tracks: Track[] | undefined | null;
  loading: boolean;
  href?: string;
};
export const SectionGrid = ({
  title,
  tracks,
  loading,
  href,
  subTitle,
}: Props) => {
  const { router } = useNavigationHistory();

  if (loading) return <SectionGridSkeleton />;

  return (
    <div className='mb-8'>
      <div className='flex items-center justify-between mb-4'>
        <div className='p-2'>
          <span className='text-xs font-bold text-muted-foreground'>
            {title}
          </span>
          <h2 className='text-white text-3xl font-bold'>
            {subTitle && subTitle}
          </h2>
        </div>

        <Button
          className='text-sm text-zinc-400 hover:text-white cursor-pointer'
          variant={'link'}
          onClick={() => router.push(href ? href : '/')}
        >
          Show all
        </Button>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {tracks &&
          tracks.map((track) => (
            <div
              key={track._id}
              onClick={() => router.push(`/albums/${track.data.album.id}`)}
              className='bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer'
            >
              <div className='mb-4'>
                <div className='relative aspect-square rounded-md shadow-lg overflow-hidden'>
                  <img
                    src={track.data.album.cover_medium}
                    alt={track.data.title}
                    className='size-full object-cover transition-transform duration-300 group-hover:scale-105'
                  />
                  <PlayBtn track={track} />
                </div>
              </div>
              <h3 className='font-medium mb-2 truncate'>{track.data.title}</h3>
              <p className='text-zinc-400 text-sm truncate'>
                {track.data.artist.name}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};
