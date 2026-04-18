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
          initial={{ opacity: 1, scale: 1, rotateX: 0 }}
          exit={{ 
            opacity: 0,
            scale: 2,
            rotateX: 45,
            filter: 'blur(20px)',
            transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
          }}
          style={{ perspective: '1000px' }}
          className="fixed inset-0 z-[2000000] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          {/* Cyber Grid Background with Parallax */}
          <motion.div 
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 cyber-grid opacity-20" 
          />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* 3D Quantum Core Animation */}
            <div className="relative w-32 h-32 mb-12 flex items-center justify-center">
              {/* Spinning 3D Rings */}
              <motion.div
                animate={{ rotateY: 360, rotateX: 180 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-red-500/50 rounded-full"
                style={{ transformStyle: 'preserve-3d' }}
              />
              <motion.div
                animate={{ rotateY: -360, rotateZ: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border-2 border-white/20 rounded-full"
                style={{ transformStyle: 'preserve-3d' }}
              />
              <motion.div
                animate={{ rotateX: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border border-red-500/30 rounded-full"
                style={{ transformStyle: 'preserve-3d' }}
              />
              
              {/* Inner Pulsing Core */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                  boxShadow: [
                    '0 0 20px rgba(239,68,68,0.2)',
                    '0 0 40px rgba(239,68,68,0.6)',
                    '0 0 20px rgba(239,68,68,0.2)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-4 h-4 bg-red-600 rounded-full" 
              />
            </div>

            {/* Logo Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8 text-center"
            >
              <h2 className="font-orbitron text-4xl sm:text-6xl font-black text-white tracking-tighter italic">
                IEEE<span className="text-red-500 text-glow">RAS</span>
              </h2>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500 to-transparent mt-2 opacity-30" />
            </motion.div>
 
            {/* Progress Bar Container */}
            <div className="w-64 sm:w-80 h-1 bg-white/5 rounded-full overflow-hidden relative border border-white/10 group">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 via-red-400 to-red-600"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-shimmer" />
              </motion.div>
            </div>
 
            {/* Status text */}
            <div className="mt-6 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[9px] text-gray-500 uppercase tracking-[0.5em] font-black">
                  Core Sync in Progress
                </span>
              </div>
              <span className="font-orbitron text-white text-sm font-bold tabular-nums tracking-widest">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
 
          {/* Decorative Corners (3D perspective) */}
          <div className="absolute top-10 left-10 w-24 h-24 border-l border-t border-red-500/20" />
          <div className="absolute top-10 right-10 w-24 h-24 border-r border-t border-red-500/20" />
          <div className="absolute bottom-10 left-10 w-24 h-24 border-l border-b border-red-500/20" />
          <div className="absolute bottom-10 right-10 w-24 h-24 border-r border-b border-red-500/20" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
