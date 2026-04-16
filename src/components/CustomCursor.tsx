import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';

// Robotic HUD & Sensor Cursor
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const tailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (isMobile) return;

    const moveCursor = (e: MouseEvent) => {
      // Precision Laser Focus
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.05,
        ease: 'none'
      });

      // Targeting HUD Ring
      gsap.to(followerRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out'
      });

      // Robotic Node Trail (Stepped delay for mechanical feel)
      tailRefs.current.forEach((dot: HTMLDivElement | null, index: number) => {
        if (!dot) return;
        gsap.to(dot, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.15 + (index * 0.05),
          ease: 'power1.out',
          overwrite: 'auto'
        });
      });
    };

    const handleMouseDown = () => {
      gsap.to(cursorRef.current, { scale: 1.5, filter: 'brightness(2)' });
      gsap.to(followerRef.current, { rotate: 90, scale: 0.8 });
    };

    const handleMouseUp = () => {
      gsap.to(cursorRef.current, { scale: 1, filter: 'brightness(1)' });
      gsap.to(followerRef.current, { rotate: 0, scale: 1 });
    };

    const handleMouseEnterLink = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      gsap.to(followerRef.current, {
        scale: 1.1,
        width: rect.width + 10,
        height: rect.height + 10,
        borderRadius: '12px',
        borderColor: 'rgba(239, 68, 68, 0.6)',
        duration: 0.35,
        ease: 'expo.out'
      });
      gsap.to(cursorRef.current, { opacity: 0 });
      tailRefs.current.forEach((dot: HTMLDivElement | null) => {
        if (dot) gsap.to(dot, { opacity: 0 });
      });

      gsap.to(followerRef.current, {
        x: centerX,
        y: centerY,
        duration: 0.4,
        ease: 'expo.out',
        overwrite: 'auto'
      });
    };

    const handleMouseLeaveLink = () => {
      gsap.to(followerRef.current, {
        scale: 1,
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        duration: 0.4,
        ease: 'expo.out'
      });
      gsap.to(cursorRef.current, { opacity: 1 });
      tailRefs.current.forEach((dot: HTMLDivElement | null) => {
        if (dot) gsap.to(dot, { opacity: 0.4 });
      });
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const addLinkEvents = () => {
      const elements = document.querySelectorAll('a, button, [role="button"]');
      elements.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnterLink);
        el.addEventListener('mouseleave', handleMouseLeaveLink);
      });
    };

    addLinkEvents();
    const observer = new MutationObserver(() => addLinkEvents());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      observer.disconnect();
    };
  }, [isMobile]);

  if (isMobile) return null;

  return createPortal(
    <>
      <div 
        ref={followerRef}
        className="fixed top-0 left-0 w-10 h-10 border border-red-500/20 z-[1000001] pointer-events-none flex items-center justify-center"
        style={{ transform: 'translate(-50%, -50%)', transition: 'border-radius 0.3s, width 0.3s, height 0.3s' }}
      >
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-500" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-500" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-500" />
      </div>

      {[...Array(5)].map((_, i) => (
        <div 
          key={i}
          ref={(el) => { tailRefs.current[i] = el; }}
          className="fixed top-0 left-0 bg-red-500/40 z-[1000000] pointer-events-none border border-red-500/20"
          style={{ 
            width: `${8 - i}px`, 
            height: `${8 - i}px`,
            opacity: 0.5 - (i * 0.1),
            transform: 'translate(-50%, -50%) rotate(45deg)', 
          }}
        />
      ))}

      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-red-600 z-[1000002] pointer-events-none shadow-[0_0_15px_#ff0000]"
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      <style>{`
        body { cursor: none !important; }
        a, button, [role="button"] { cursor: none !important; }
      `}</style>
    </>,
    document.body
  );
}

