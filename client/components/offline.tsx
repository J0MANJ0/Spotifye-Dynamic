import { RefreshCw, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Loader from './kokonutui/loader';

export const Offline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setChecking(true);

    setTimeout(() => {
      setChecking(false);
      if (navigator.onLine) {
        setIsOnline(true);
      }
    }, 1500);
  };

  if (isOnline) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className='flex justify-center items-center flex-col w-full min-h-screen bg-black/20 gap-6'
    >
      <WifiOff className='size-20 text-zinc-600' />
      <motion.h2
        initial={{ x: 0, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.8,
          repeat: Infinity,
          repeatType: 'mirror',
          repeatDelay: 0.8,
        }}
        className='text-6xl font-bold text-gray-200'
      >
        You're offline!
      </motion.h2>
      <p className='text-sm text-gray-400'>
        Make sure you're online. Spotifye works best with an internet
        connection.
      </p>

      <motion.button
        onClick={handleRetry}
        disabled={checking}
        whileTap={{ scale: 0.95 }}
        className={`px-6 py-2 rounded-xl flex items-center gap-2 border-2 text-green-400 font-medium transition ${
          checking ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {checking ? (
          <>
            <RefreshCw className='animate-spin size-4' /> Checking...
          </>
        ) : (
          <>
            <RefreshCw className='size-4' /> Retry Connection
          </>
        )}
      </motion.button>

      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'mirror',
        }}
        className='text-xs text-zinc-500 mt-6'
      >
        Waiting for network...
      </motion.div>
    </motion.div>
  );
};
