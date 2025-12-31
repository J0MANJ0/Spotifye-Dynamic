'use client';

import { useChatStore } from '@/stores/use-chat-store';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { Tooltip } from '@mui/material';
import { Input } from '@/components/ui/input';

export const MessageInput = () => {
  const [newMessage, setNewMessage] = useState('');
  const { selectedUser, sendMessage } = useChatStore();
  const { user } = useUser();

  const handleSend = () => {
    if (!selectedUser || !user || !newMessage) return;
    sendMessage(selectedUser.clerkId, user.id, newMessage.trim());
    setNewMessage('');
  };

  return (
    <div className='p-4 mt-auto border-t border-zinc-800'>
      <div className='flex gap-2'>
        <Input
          placeholder='Type a message'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className='bg-zinc-800 border-none'
          onKeyDown={(e) => e.key === 'Enter' && handleSend}
        />
        <Tooltip placement='top' title={!newMessage ? '' : 'Send message'}>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            style={{
              opacity: !newMessage ? 0.5 : 1,
              cursor: !newMessage ? 'not-allowed' : 'pointer',
            }}
            className='hover:scale-[1.130] transition-all'
          >
            <SendIcon fontSize='large' sx={{ color: '#4ade80' }} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
