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
import { Calendar, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

export const TrackTable = () => {
  const { tracks, loadingTrack: loading, deleteTrack } = useMusicStore();
  const [currentPage, setCurrentPage] = useState(1);
  const items = 10;
  const pages = Math.ceil(tracks.length / items);
  const startIdx = (currentPage - 1) * items;

  const paginatedSongs = tracks.slice(startIdx, startIdx + items);

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const nextPage = () => {
    if (currentPage < pages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className='space-y-4'>
      <Table>
        <TableHeader>
          <TableRow className='hover:bg-zinc-800/50'>
            <TableHead className='w-[50px]'></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Album</TableHead>
            <TableHead>Release Date</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedSongs.map((track) => (
            <TableRow key={track?._id} className='hover:bg-zinc-800/50'>
              <TableCell>
                <img
                  src={track?.data?.album?.cover_medium}
                  alt={track?.data?.title}
                  className='size-10 rounded object-cover'
                />
              </TableCell>
              <TableCell className='font-medium'>
                {track?.data?.title}
              </TableCell>
              <TableCell>{track?.data?.artist?.name}</TableCell>
              <TableCell>{track?.albumId}</TableCell>
              <TableCell>
                <span className='inline-flex items-center gap-1 text-zinc-400'>
                  <Calendar className='size-4' />
                  {track?.createdAt.split('T')[0]}
                </span>
              </TableCell>
              <TableCell className='text-right'>
                <div className='flex gap-2 justify-end'>
                  <Button
                    onClick={() => deleteTrack(track?._id)}
                    variant={'ghost'}
                    size={'sm'}
                    className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
                  >
                    <Trash2 className='size-4' />
                  </Button>
                  {/* <UpdateSongDialog
                    id={track._id}
                    title={track.title}
                    artist={track.artist}
                  /> */}
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
