import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { row1Images, row2Images } from '../data/gallery';

export default function Gallery() {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tweens: gsap.core.Tween[] = [];

    const setupMarquee = (el: HTMLDivElement | null, direction: 'left' | 'right', speed: number) => {
      if (!el) return;

      const totalWidth = el.scrollWidth / 2;
      gsap.set(el, { x: 0 });

      const tween = gsap.to(el, {
        x: direction === 'left' ? -totalWidth : totalWidth,
        duration: speed,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: (x) => {
            const num = parseFloat(x);
            const wrapped = gsap.utils.wrap(-totalWidth, 0, num);
            return `${wrapped}px`;
          }
        }
      });

      tweens.push(tween);

      // ── Drag-to-scroll logic ──
      let isDragging = false;
      let startX = 0;
      let startTranslateX = 0;

      const getTranslateX = () => {
        const transform = window.getComputedStyle(el).transform;
        if (transform === 'none') return 0;
        const matrix = new DOMMatrix(transform);
        return matrix.m41;
      };

      const onPointerDown = (e: PointerEvent) => {
        isDragging = true;
        startX = e.clientX;
        startTranslateX = getTranslateX();
        tween.pause();
        el.setPointerCapture(e.pointerId);
        el.style.cursor = 'grabbing';
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const newX = startTranslateX + dx;
        // Wrap within bounds for seamless loop
        const wrapped = ((newX % totalWidth) + totalWidth) % totalWidth - totalWidth;
        gsap.set(el, { x: wrapped });
      };

      const onPointerUp = (e: PointerEvent) => {
        if (!isDragging) return;
        isDragging = false;
        el.releasePointerCapture(e.pointerId);
        el.style.cursor = 'grab';

        // Resume the tween from current position
        const currentX = getTranslateX();
        const progress = direction === 'left' 
          ? Math.abs(currentX) / totalWidth 
          : (totalWidth - currentX) / totalWidth;
        
        tween.progress(progress % 1);
        tween.play();
      };

      el.style.cursor = 'grab';
      el.style.touchAction = 'pan-y';
      el.addEventListener('pointerdown', onPointerDown);
      el.addEventListener('pointermove', onPointerMove);
      el.addEventListener('pointerup', onPointerUp);
      el.addEventListener('pointercancel', onPointerUp);

      (el as any)._dragCleanup = () => {
        el.removeEventListener('pointerdown', onPointerDown);
        el.removeEventListener('pointermove', onPointerMove);
        el.removeEventListener('pointerup', onPointerUp);
        el.removeEventListener('pointercancel', onPointerUp);
      };
    };

    const timer = setTimeout(() => {
      setupMarquee(row1Ref.current, 'left', 65);
      setupMarquee(row2Ref.current, 'right', 70);
    }, 500);

    return () => {
      clearTimeout(timer);
      tweens.forEach(t => t.kill());
      [row1Ref.current, row2Ref.current].forEach(el => {
        if (el) {
          gsap.killTweensOf(el);
          (el as any)._dragCleanup?.();
        }
      });
    };
  }, []);

  return (
    <section id="gallery" className="relative py-14 lg:py-20 overflow-hidden bg-transparent">
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      <div className="relative flex flex-col gap-8 sm:gap-12">
        {/* Row 1 - Content moves left */}
        <div className="relative overflow-hidden w-full h-[180px] sm:h-[260px]">
          <div ref={row1Ref} className="flex gap-4 sm:gap-6 whitespace-nowrap absolute left-0 h-full select-none">
            {[...row1Images, ...row1Images].map((img, i) => (
              <div
                key={i}
                className="w-[260px] sm:w-[380px] h-full rounded-2xl overflow-hidden border border-foreground/10 dark:border-white/10 group relative flex-shrink-0"
              >
                <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none" alt="" loading="lazy" decoding="async" />
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
          <div ref={row2Ref} className="flex gap-4 sm:gap-6 whitespace-nowrap absolute left-0 h-full select-none">
            {[...row2Images, ...row2Images].map((img, i) => (
              <div
                key={i}
                className="w-[260px] sm:w-[380px] h-full rounded-2xl overflow-hidden border border-foreground/10 dark:border-white/10 group relative flex-shrink-0"
              >
                <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none" alt="" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
