import { useNavigationHistory } from '@/hooks/use-nav';
import { SidebarTrigger } from './ui/sidebar';
import HomeIcon from '@mui/icons-material/Home';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import Link from 'next/link';

export const LeftRail = () => {
  const { pathname } = useNavigationHistory();

  return (
    <div className='flex h-full flex-col items-center gap-4 py-4'>
      <SidebarTrigger className='mt-auto' />
    </div>
  );
};
