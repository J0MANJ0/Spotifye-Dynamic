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
import { Calendar, Music, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

type Props = {};
export const LyrcisTable = () => {
  const { lrcs, loadingLrc: loading, fetchLrcs } = useMusicStore();

  const [currentPage, setCurrentPage] = useState(1);

  const items = 5;

  const pages = Math.ceil(lrcs.length / items);

  const startIdx = (currentPage - 1) * items;

  const paginatedLrcs = lrcs.slice(startIdx, startIdx + items);

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const nextPage = () => {
    if (currentPage < pages) setCurrentPage((p) => p + 1);
  };

  useEffect(() => {
    fetchLrcs();
  }, [fetchLrcs]);

  console.log(lrcs);
  return (
    <div className='space-y-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Track ID</TableHead>
            <TableHead>Format</TableHead>
            <TableHead>Release Year</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedLrcs.map((lrc) => (
            <TableRow key={lrc._id} className='hover:bg-zinc-800/50'>
              <TableCell className='font-medium'>{lrc.trackId}</TableCell>
              <TableCell className='font-medium'>{lrc.lyrics.format}</TableCell>
              <TableCell>
                <span className='inline-flex items-center gap-1 text-zinc-400'>
                  <Calendar className='h-4 w-4' />
                  {lrc.createdAt.split(':')[0].split('-')[0]}
                </span>
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
