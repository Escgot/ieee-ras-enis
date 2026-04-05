import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const row1Images = [
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1582213708913-3e0850228833?auto=format&fit=crop&q=80',
];

const row2Images = [
  'https://images.unsplash.com/photo-1523240715639-960cda6c2211?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600880212319-7524eee002be?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80',
];

export default function Gallery() {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setupMarquee = (ref: React.RefObject<HTMLDivElement | null>, direction: number, speed: number) => {
      if (!ref.current) return;
      const el = ref.current;
      const totalWidth = el.scrollWidth / 2;
      
      gsap.to(el, {
        x: direction > 0 ? -totalWidth : totalWidth,
        duration: speed,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((val) => {
            const num = parseFloat(val);
            return direction > 0 
              ? (num % totalWidth) 
              : (num < 0 ? (num % totalWidth) + totalWidth : num % totalWidth) - totalWidth;
          })
        }
      });
    };

    setupMarquee(row1Ref, 1, 40);
    setupMarquee(row2Ref, -1, 45);

    return () => {
      gsap.killTweensOf([row1Ref.current, row2Ref.current].filter(Boolean));
    };
  }, []);

  return (
    <section id="gallery" className="relative py-14 lg:py-20 overflow-hidden bg-[#090909]">
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      
      <div className="relative flex flex-col gap-8 sm:gap-12">
        {/* Row 1 */}
        <div className="relative overflow-hidden w-full h-[180px] sm:h-[260px]">
          <div ref={row1Ref} className="flex gap-4 sm:gap-6 whitespace-nowrap absolute left-0 h-full">
            {[...row1Images, ...row1Images].map((img, i) => (
              <div 
                key={i} 
                className="w-[260px] sm:w-[380px] h-full rounded-2xl overflow-hidden border border-white/10 group relative"
              >
                <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
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
            
            <h2 className="font-orbitron text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-none uppercase tracking-tighter">
              Our <span className="text-gradient">Gallery</span>
            </h2>
            
            <div className="flex flex-col items-center gap-2">
              <p className="text-gray-500 uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold">
                Capturing innovation and community since 2013
              </p>
              <div className="w-12 h-1 bg-gradient-to-r from-red-600 to-purple-600 rounded-full" />
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="relative overflow-hidden w-full h-[180px] sm:h-[260px]">
          <div ref={row2Ref} className="flex gap-4 sm:gap-6 whitespace-nowrap absolute right-0 h-full">
            {[...row2Images, ...row2Images].map((img, i) => (
              <div 
                key={i} 
                className="w-[260px] sm:w-[380px] h-full rounded-2xl overflow-hidden border border-white/10 group relative"
              >
                <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative environment blur */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />
    </section>
  );
}
