'use client';

import { useEffect } from 'react';
import { usePlaybackStore } from '@/stores/use-playback-store';
import { usePlayerStore } from '@/stores/use-player-store';
import { useMusicStore } from '@/stores/use-music-store';

export const PlaybackResolver = () => {
  const playback = usePlaybackStore();
  const tracksById = useMusicStore((s) => s.tracksByIds);

  useEffect(() => {
    const track = playback.currentTrackIdId
      ? tracksById[playback.currentTrackIdId]
      : null;

    if (track) {
      usePlayerStore.setState({
        currentTrackId: track,
      });
    }

    usePlayerStore.setState({
      queue: playback.queueIds.map((id) => tracksById[id]).filter(Boolean),
      shuffledQueue: playback.shuffledQueueIds
        .map((id) => tracksById[id])
        .filter(Boolean),
    });
  }, [playback.currentTrackIdId, playback.shuffledQueueIds, playback.queueIds]);

  return null;
};
