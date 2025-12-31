'use client';

import { useFollowStore } from '@/stores/use-follow-store';
import { Button } from './ui/button';
import { useNavigationHistory } from '@/hooks/use-nav';
import { ArtistTrackInfo } from '@/types';

type Props = {
  artist: ArtistTrackInfo;
};

export const CreditsArtistCard = ({ artist }: Props) => {
  const { followedArtists, followTarget, unfollowTarget, loading } =
    useFollowStore();

  const { router } = useNavigationHistory();

  const isFollowed = followedArtists?.some(
    (a) => a.target?.data?.id === artist.id
  );

  const handleSubmit = () => {
    isFollowed
      ? unfollowTarget('artists', artist?.id, null)
      : followTarget('artists', artist?.id, null);
  };

  return (
    <div key={artist?.id} className='flex justify-between items-center mb-2'>
      <div className='flex flex-col'>
        <div className=''>
          <span
            className='text-sm font-semibold hover:underline cursor-pointer'
            onClick={() => router.push(`/artists/${artist?.id}`)}
          >
            {artist?.name}
          </span>
        </div>
        <div>
          <span className='text-xs text-muted-foreground'>
            {artist.role} Artist
          </span>
        </div>
      </div>
      <div>
        <Button
          className='flex items-center justify-center rounded-2xl bg-zinc-900 text-white text-xs px-8 border border-gray-400 hover:scale-102 hover:border-gray-200 hover:bg-zinc-800 cursor-pointer'
          onClick={handleSubmit}
        >
          {isFollowed ? 'Unfollow' : 'Follow'}
        </Button>
      </div>
    </div>
  );
};
