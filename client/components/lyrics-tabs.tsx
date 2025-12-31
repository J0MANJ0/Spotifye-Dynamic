import { Mic2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { AddLyricsDialog } from './add-lyrics-dialog';
import { LyrcisTable } from './lyrics-table';

export const LyricsTabs = () => {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <Mic2 className='h-5 w-5 text-green-500' />
              Lyrics Library
            </CardTitle>
            <CardDescription>Manage your lyrics collection</CardDescription>
          </div>
          <AddLyricsDialog />
        </div>
      </CardHeader>
      <CardContent>
        <LyrcisTable />
      </CardContent>
    </Card>
  );
};
