'use client';

import { Power, TabletSmartphone, Wifi } from 'lucide-react';
import React from 'react';
import { Tooltip } from '@mui/material';

export const NoDevicesFound = () => {
  const helpers = [
    {
      id: 1,
      icon: Wifi,
      title: 'Check your WiFi',
      description: "Connect the devices you're using to the same WiFi.",
    },
    {
      id: 2,
      icon: TabletSmartphone,
      title: 'Play from another device',
      description: 'It will automatically appear here.',
    },
    {
      id: 3,
      icon: Power,
      title: 'Restart your speaker',
      description: "Or follow setup instructions if it's a new device.",
    },
  ];
  return (
    <div className='w-full bg-zinc-900 rounded-md'>
      <div className='flex flex-col p-2 gap-8'>
        <div>
          <h3 className='text-sm font-semibold'>No other devices found</h3>
        </div>
        <div className='flex flex-col gap-10'>
          {helpers.map((h) => (
            <HelperCard
              key={h.id}
              icon={h.icon}
              title={h.title}
              description={h.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const HelperCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => {
  return (
    <div className='flex items-center justify-start gap-4'>
      <div>
        <Icon className='text-muted-foreground' />
      </div>
      <div className='flex flex-col'>
        <Tooltip placement='top-start' title={title}>
          <h3 className='text-sm font-semibold'>{title}</h3>
        </Tooltip>
        <p className='text-xs font-mono text-muted-foreground'>{description}</p>
      </div>
    </div>
  );
};
