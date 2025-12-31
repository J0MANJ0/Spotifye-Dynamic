'use client';

import { useMusicStore } from '@/stores/use-music-store';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import Image from 'next/image';
import { Calendar, Music, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

export const AlbumsTable = () => {
  const { albums, deleteAlbum } = useMusicStore();
  const [currentPage, setCurrentPage] = useState(1);

  const items = 5;

  const pages = Math.ceil(albums.length / items);

  const startIdx = (currentPage - 1) * items;

  const paginatedAlbums = albums.slice(startIdx, startIdx + items);

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const nextPage = () => {
    if (currentPage < pages) setCurrentPage((p) => p + 1);
  };

  return (
    <div className='space-y-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px]'></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Release Year</TableHead>
            <TableHead>Tracks</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedAlbums.map((album) => (
            <TableRow key={album._id} className='hover:bg-zinc-800/50'>
              <TableCell>
                <Image
                  src={album.data.cover_medium}
                  alt={album.data.title}
                  className='w-10 h-10 rounded object-cover'
                  width={20}
                  height={20}
                />
              </TableCell>
              <TableCell className='font-medium'>{album.data.title}</TableCell>
              <TableCell className='font-medium'>
                {album.data.artist?.name}
              </TableCell>
              <TableCell>
                <span className='inline-flex items-center gap-1 text-zinc-400'>
                  <Calendar className='h-4 w-4' />
                  {album.data.release_date.split('-')[0]}
                </span>
              </TableCell>
              <TableCell>
                <span className='inline-flex items-center gap-1 text-zinc-400'>
                  <Music className='h-4 w-4' />
                  {album.tracks.length}{' '}
                  {album.tracks.length === 1 ? 'track' : 'tracks'}
                </span>
              </TableCell>
              <TableCell className='text-right'>
                <div className='flex gap-2 justify-end'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => deleteAlbum(album._id)}
                    className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
                  >
                    <Trash2 className='size-4' />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className='flex justify-center pt-4'>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={prevPage}
                className={`${
                  currentPage === 1 && 'opacity-50 pointer-events-none'
                }`}
              />
            </PaginationItem>
            <div className='text-sm text-zinc-400 px-4'>
              Page {currentPage} of {pages}
            </div>
            <PaginationItem>
              <PaginationNext
                onClick={nextPage}
                className={`${
                  currentPage === pages && 'opacity-50 pointer-events-none'
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
