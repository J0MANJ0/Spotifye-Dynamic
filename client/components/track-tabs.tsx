import { Music } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { AddTrackDialog } from './add-track-dialog';
import { TrackTable } from './track-table';

export const TrackTabs = () => {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <Music className='size-5 text-emerald-500' />
              Tracks Library
            </CardTitle>
            <CardDescription>Manage your music tracks</CardDescription>
          </div>
          <AddTrackDialog />
        </div>
      </CardHeader>
      <CardContent>
        <TrackTable />
      </CardContent>
    </Card>
  );
};
