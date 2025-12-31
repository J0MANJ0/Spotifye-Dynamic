import { Library } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { AddAlbumDialog } from './add-album-dialog';
import { AlbumsTable } from './albums-table';

export const AlbumsTabs = () => {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <Library className='h-5 w-5 text-violet-500' />
              Albums Library
            </CardTitle>
            <CardDescription>Manage your album collection</CardDescription>
          </div>
          <AddAlbumDialog />
        </div>
      </CardHeader>

      <CardContent>
        <AlbumsTable />
      </CardContent>
    </Card>
  );
};
