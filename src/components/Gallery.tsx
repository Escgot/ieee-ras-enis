import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { row1Images, row2Images } from '../data/gallery';

export default function Gallery() {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setupMarquee = (el: HTMLDivElement | null, direction: 'left' | 'right', speed: number) => {
      if (!el) return;

      const totalWidth = el.scrollWidth / 2;

      // Ensure the initial state is clean
      gsap.set(el, { x: 0 });

      // Create a seamless timeline or a continuous tween
      gsap.to(el, {
        x: direction === 'left' ? -totalWidth : totalWidth,
        duration: speed,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: (x) => {
            const num = parseFloat(x);
            // Use GSAP's built-in wrap utility for mathematically perfect looping
            // This prevents "jumps" or "restarts" by wrapping the value within the bounds
            const wrapped = gsap.utils.wrap(-totalWidth, 0, num);
            return `${wrapped}px`;
          }
        }
      });
    };

    // Images take a moment to report their proper scrollWidth
    // A longer delay helps ensure the calculation is 100% accurate
    const timer = setTimeout(() => {
      setupMarquee(row1Ref.current, 'left', 65);
      setupMarquee(row2Ref.current, 'right', 70);
    }, 500);

    return () => {
      clearTimeout(timer);
      if (row1Ref.current) gsap.killTweensOf(row1Ref.current);
      if (row2Ref.current) gsap.killTweensOf(row2Ref.current);
    };
  }, []);

  return (
    <section id="gallery" className="relative py-14 lg:py-20 overflow-hidden bg-transparent">
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      <div className="relative flex flex-col gap-8 sm:gap-12">
        {/* Row 1 - Content moves left */}
        <div className="relative overflow-hidden w-full h-[180px] sm:h-[260px]">
          <div ref={row1Ref} className="flex gap-4 sm:gap-6 whitespace-nowrap absolute left-0 h-full">
            {[...row1Images, ...row1Images].map((img, i) => (
              <div
                key={i}
                className="w-[260px] sm:w-[380px] h-full rounded-2xl overflow-hidden border border-foreground/10 dark:border-white/10 group relative flex-shrink-0"
              >
                <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Center Title Layout */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4 w-full">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-500/20 to-red-500/40" />
              <span className="section-tag shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Moments
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-red-500/20 to-red-500/40" />
            </div>

            <h2 className="font-orbitron text-4xl sm:text-5xl lg:text-7xl font-black text-foreground leading-none uppercase tracking-tighter">
              Our <span className="text-gradient">Gallery</span>
            </h2>

            <div className="flex flex-col items-center gap-2">
              <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold">
                Capturing innovation and community since 2013
              </p>
              <div className="w-12 h-1 bg-gradient-to-r from-red-600 to-purple-600 rounded-full" />
            </div>
          </div>
        </div>

        {/* Row 2 - Content moves right */}
        <div className="relative overflow-hidden w-full h-[180px] sm:h-[260px]">
          <div ref={row2Ref} className="flex gap-4 sm:gap-6 whitespace-nowrap absolute left-0 h-full">
            {[...row2Images, ...row2Images].map((img, i) => (
              <div
                key={i}
                className="w-[260px] sm:w-[380px] h-full rounded-2xl overflow-hidden border border-foreground/10 dark:border-white/10 group relative flex-shrink-0"
              >
                <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
