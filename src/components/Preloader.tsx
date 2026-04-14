import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: '-100%', 
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[2000000] flex flex-col items-center justify-center bg-background"
        >
          {/* Cyber Grid Background */}
          <div className="absolute inset-0 cyber-grid opacity-20" />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="font-orbitron text-4xl sm:text-6xl font-black text-foreground tracking-tighter italic">
                IEEE<span className="text-red-500">RAS</span>
              </h2>
            </motion.div>

            {/* Progress Bar Container */}
            <div className="w-48 sm:w-64 h-1 bg-foreground/10 dark:bg-white/10 rounded-full overflow-hidden relative border border-foreground/5 dark:border-white/5">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 to-red-400"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Status text */}
            <div className="mt-4 flex flex-col items-center">
              <span className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black animate-pulse">
                Initializing Core Systems
              </span>
              <span className="mt-2 font-orbitron text-foreground text-xs font-bold tabular-nums">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Decorative Corners */}
          <div className="absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-red-500/30" />
          <div className="absolute top-10 right-10 w-20 h-20 border-r-2 border-t-2 border-red-500/30" />
          <div className="absolute bottom-10 left-10 w-20 h-20 border-l-2 border-b-2 border-red-500/30" />
          <div className="absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-red-500/30" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
