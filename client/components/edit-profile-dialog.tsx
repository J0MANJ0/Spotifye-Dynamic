'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Mail, Pencil, User } from 'lucide-react';
import { Input } from './ui/input';
import { useAuthStore } from '@/stores/use-auth-store';
import toast from 'react-hot-toast';

export const EditProfileDialog = () => {
  const { user, updateProfile, loading, getUser } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState({
    firstName: user?.fullName.split(' ')[0],
    lastName: user?.fullName.split(' ')[1],
  });

  const handleSubmit = async () => {
    const { firstName, lastName } = details;
    if (!firstName || !lastName) {
      toast.error('Missing field(s)');
      return;
    }

    const formData = new FormData();

    formData.append('fullName', firstName + ' ' + lastName);

    await updateProfile(formData);

    setDetails({ firstName: '', lastName: '' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='rounded-3xl border border-gray-200 bg-zinc-800 text-white hover:scale-105 px-4 flex hover:bg-zinc-900 cursor-pointer'>
          Edit
          <Pencil className='' />
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-zinc-950 border-none'>
        <DialogHeader>
          <DialogTitle className='text-center text-3xl font-semibold'>
            Your Profile
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className='text-center'>
          Update your username
        </DialogDescription>

        <div className='w-full flex flex-col p-2 gap-4'>
          <div className='flex flex-col gap-2'>
            <div className='flex gap-2'>
              <User className='text-green-500' />
              <label className='text-md font-mono'>First Name</label>
            </div>
            <Input
              value={details.firstName}
              onChange={(e) =>
                setDetails((p) => ({ ...p, firstName: e.target.value }))
              }
              placeholder='Enter your first name'
              className='border-2 border-white focus-visible:border-white focus-visible:ring-0 py-6'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex gap-2'>
              <User className='text-green-500' />
              <label className='text-md font-mono'>Last Name</label>
            </div>
            <Input
              value={details.lastName}
              onChange={(e) =>
                setDetails((p) => ({ ...p, lastName: e.target.value }))
              }
              placeholder='Enter your last name'
              className='border-2 border-white focus-visible:border-white focus-visible:ring-0 py-6'
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => setOpen(false)}
              variant={'destructive'}
              className='cursor-pointer'
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className='cursor-pointer'
              disabled={loading || !details.firstName || !details.lastName}
            >
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
