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
          setTimeout(() => setLoading(false), 800);
          return 100;
        }
        const diff = Math.random() * 15;
        return Math.min(oldProgress + diff, 100);
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.1,
            filter: 'blur(30px)',
            transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[2000000] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          {/* Background Image Container */}
          <motion.div 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 0.4,
              y: [0, -10, 0],
            }}
            transition={{ 
              opacity: { duration: 2 },
              scale: { duration: 2.5, ease: "easeOut" },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute inset-0 z-0 flex items-center justify-center"
          >
            <img 
              src="/images/preloader/robot-loader.webp" 
              alt="System Interface" 
              className="w-full h-full object-cover lg:scale-110"
            />
            {/* Pulsing Overlay to match neon */}
            <motion.div 
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-red-500/5 mix-blend-color-dodge"
            />
          </motion.div>

          {/* Cyber Grid Overlay */}
          <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

          {/* Scanning Line Effect */}
          <motion.div 
            animate={{ top: ['-10%', '110%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-[2px] bg-red-500/30 blur-[2px] z-10 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
          />

          {/* Digital Noise / Film Grain */}
          <div className="absolute inset-0 noise-overlay opacity-[0.03] pointer-events-none" />

          {/* Main Interface Content */}
          <div className="relative z-20 flex flex-col items-center w-full max-w-4xl px-6">
            
            {/* Top Scanning Metadata */}
            <div className="absolute -top-32 left-0 right-0 flex justify-between items-start opacity-40">
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-black text-red-500 uppercase tracking-[0.4em]">RAS-ENIS-V26</span>
                <span className="text-[8px] font-bold text-white/50 uppercase tracking-[0.2em]">{new Date().toISOString()}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[8px] font-black text-red-500 uppercase tracking-[0.4em]">Status: Booting</span>
                <span className="text-[8px] font-bold text-white/50 uppercase tracking-[0.2em]">Priority: High</span>
              </div>
            </div>

            {/* Central Animated Core */}
            <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
              {/* Outer Energy Field */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[3px] border-dashed border-red-500/10 rounded-full"
              />
              
              {/* Spinning 3D Rings */}
              <motion.div
                animate={{ rotateY: 360, rotateX: 180 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-2 border-red-500/40 rounded-full"
                style={{ transformStyle: 'preserve-3d' }}
              />
              <motion.div
                animate={{ rotateY: -360, rotateZ: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 border-2 border-white/10 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                style={{ transformStyle: 'preserve-3d' }}
              />
              
              {/* Inner Pulsing Node */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/50 flex items-center justify-center" 
              >
                  <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,1)]" />
              </motion.div>
            </div>

            {/* Branding */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-10"
            >
              <h1 className="font-orbitron text-5xl sm:text-7xl font-black text-white tracking-widest uppercase italic translate-x-2 animate-[chromatic-aberration_4s_infinite]">
                IEEE <span className="text-red-500 text-glow"> RAS</span> ENIS
              </h1>
              <div className="flex items-center gap-4 mt-2 justify-center opacity-40">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-500" />
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white">DISCOVER OUR JOURNEY</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-500" />
              </div>
            </motion.div>

            {/* Progress Container */}
            <div className="w-full max-w-sm flex flex-col items-center">
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative border border-white/10">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 via-red-400 to-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                  animate={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-shimmer" />
                </motion.div>
              </div>

              {/* Status & Percentage */}
              <div className="mt-6 flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black">
                    {progress < 100 ? 'Synchronizing Archive...' : 'Ready for Deployment'}
                  </span>
                </div>
                <span className="font-orbitron text-red-500 text-sm font-black tabular-nums tracking-tighter">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>

          {/* Circular Metadata HUD Element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/[0.03] rounded-full pointer-events-none scale-150 lg:scale-100" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-red-500/[0.03] rounded-full pointer-events-none scale-150 lg:scale-100" />

          {/* Decorative Corner Brackets */}
          <div className="absolute top-12 left-12 w-16 h-16 border-l-2 border-t-2 border-red-500/20" />
          <div className="absolute top-12 right-12 w-16 h-16 border-r-2 border-t-2 border-red-500/20" />
          <div className="absolute bottom-12 left-12 w-16 h-16 border-l-2 border-b-2 border-red-500/20" />
          <div className="absolute bottom-12 right-12 w-16 h-16 border-r-2 border-b-2 border-red-500/20" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

