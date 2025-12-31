import { motion } from 'framer-motion';

export const PlayingBars = () => {
  return (
    <div className='flex items-end gap-1 h-5 group-hover:hidden'>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className='w-1 bg-green-500 rounded'
          animate={{ height: ['20%', '100%', '40%'] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};
