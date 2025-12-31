'use client';

import { useMusicStore } from '@/stores/use-music-store';
import { Library, ListMusic, Mic2, User, Users2 } from 'lucide-react';
import { StatCard } from './stat-card';

export const DashboardStats = () => {
  const { stats } = useMusicStore();

  const statsData = [
    {
      icon: ListMusic,
      label: 'Total Tracks',
      value: stats.tracks.toString(),
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
    },
    {
      icon: Library,
      label: 'Total Albums',
      value: stats.albums.toString(),
      bgColor: 'bg-violet-500/10',
      iconColor: 'text-violet-500',
    },
    {
      icon: Users2,
      label: 'Total Artists',
      value: stats.artists.toString(),
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-500',
    },
    {
      icon: User,
      label: 'Total Users',
      value: stats.users.toLocaleString(),
      bgColor: 'bg-sky-500/10',
      iconColor: 'text-sky-500',
    },
    {
      icon: Mic2,
      label: 'Total Lyrics',
      value: stats.lyrics.toLocaleString(),
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-500',
    },
  ];
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8'>
      {statsData.map((stat, i) => (
        <StatCard
          key={i}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          bgColor={stat.bgColor}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
};
