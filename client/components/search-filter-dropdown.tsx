'use client';

import { useMusicStore } from '@/stores/use-music-store';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Filter } from 'lucide-react';

export const SearchFilterDropdown = () => {
  const { reverseSongsOrder, toggleReverse, sortKey, setSortKey } =
    useMusicStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'outline'} className='flex items-center gap-2'>
          <Filter className='size-4' />
          Filters (
          {sortKey === 'createdAt'
            ? 'Released'
            : sortKey.charAt(0).toUpperCase() + sortKey.slice(1)}
          )
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-52'>
        <DropdownMenuLabel>Sort by Fields</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={sortKey}
          onValueChange={(value: string) =>
            setSortKey(value as 'title' | 'artist' | 'createdAt')
          }
        >
          <DropdownMenuRadioItem value='title'>Title</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='artist'>Artist</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='date'>Date</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='createdAt'>
            Release Date
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        {sortKey === 'title' ||
          (sortKey !== 'createdAt' && (
            <>
              <DropdownMenuLabel>Date</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={!reverseSongsOrder}
                onCheckedChange={toggleReverse}
              >
                Newest fisrt
              </DropdownMenuCheckboxItem>
            </>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
