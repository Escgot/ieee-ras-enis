import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';

// Ultra-Premium Cursor with Light Streak Trail
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const tailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; angle: number; speed: number }[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (isMobile) return;

    const moveCursor = (e: MouseEvent) => {
      // Main Center Dot
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      // Rapid Follower Ring
      gsap.to(followerRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power3.out'
      });

      // 8-Stage Light Streak Tail
      tailRefs.current.forEach((dot, index) => {
        if (!dot) return;
        gsap.to(dot, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.2 + (index * 0.08), // Highly responsive staggering
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    };

    const handleMouseDown = (e: MouseEvent) => {
      gsap.to(cursorRef.current, { scale: 0.6 });
      gsap.to(followerRef.current, { scale: 1.4, backgroundColor: 'rgba(239, 68, 68, 0.2)' });
      tailRefs.current.forEach(dot => gsap.to(dot, { scale: 1.5, opacity: 0.8, filter: 'blur(4px)' }));

      const burstId = Date.now();
      const newParticles = Array.from({ length: 12 }).map((_, i) => ({
        id: burstId + i,
        x: e.clientX,
        y: e.clientY,
        angle: (i / 12) * Math.PI * 2 + (Math.random() * 0.5),
        speed: 40 + Math.random() * 40
      }));

      setParticles((prev) => [...prev, ...newParticles]);
      setTimeout(() => {
        setParticles((prev) => prev.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 800);
    };

    const handleMouseUp = () => {
      gsap.to(cursorRef.current, { scale: 1 });
      gsap.to(followerRef.current, { scale: 1, backgroundColor: 'transparent' });
      tailRefs.current.forEach(dot => gsap.to(dot, { scale: 1, opacity: 0.4, filter: 'blur(2px)' }));
    };

    const handleMouseEnterLink = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      gsap.to(followerRef.current, {
        scale: 2.8,
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        borderColor: 'rgba(239, 68, 68, 0.8)',
        duration: 0.5,
        ease: 'expo.out'
      });
      gsap.to(cursorRef.current, { opacity: 0, scale: 0, duration: 0.3 });
      tailRefs.current.forEach(dot => gsap.to(dot, { opacity: 0, scale: 0, duration: 0.3 }));

      gsap.to(followerRef.current, {
        x: centerX,
        y: centerY,
        duration: 0.6,
        ease: 'expo.out',
        overwrite: 'auto'
      });
    };

    const handleMouseLeaveLink = () => {
      gsap.to(followerRef.current, {
        scale: 1,
        backgroundColor: 'transparent',
        borderColor: 'currentColor',
        duration: 0.4,
        ease: 'expo.out'
      });
      gsap.to(cursorRef.current, { opacity: 1, scale: 1, duration: 0.3 });
      tailRefs.current.forEach(dot => gsap.to(dot, { opacity: 0.4, scale: 1, duration: 0.4 }));
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const addLinkEvents = () => {
      const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
      interactiveElements.forEach((el) => {
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
      {/* 8-Stage Dynamic Energy Tail */}
      {[...Array(8)].map((_, i) => (
        <div 
          key={i}
          ref={el => tailRefs.current[i] = el}
          className="fixed top-0 left-0 rounded-full z-[1000000] pointer-events-none"
          style={{ 
            width: `${12 - i * 1.4}px`, 
            height: `${12 - i * 1.4}px`,
            backgroundColor: 'rgba(239, 68, 68, 1)',
            opacity: 0.4 - (i * 0.05),
            transform: 'translate(-50%, -50%)',
            filter: `blur(${1 + i * 0.5}px)`,
            boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)'
          }}
        />
      ))}

      {/* Main Core Dot */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-red-600 rounded-full z-[1000002] pointer-events-none mix-blend-difference shadow-[0_0_15px_rgba(239,68,68,0.8)]"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      
      {/* Follower Aura */}
      <div 
        ref={followerRef}
        className="fixed top-0 left-0 w-10 h-10 border border-red-500/20 dark:border-red-500/40 rounded-full z-[1000001] pointer-events-none transition-all duration-300 flex items-center justify-center text-red-500 shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <div className="absolute inset-2 rounded-full border border-red-500/5" />
      </div>

      {/* Click Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed top-0 left-0 pointer-events-none z-[1000000] animate-particle"
          style={{
            left: p.x,
            top: p.y,
            '--tx': `${Math.cos(p.angle) * p.speed}px`,
            '--ty': `${Math.sin(p.angle) * p.speed}px`,
            transform: 'translate(-50%, -50%)',
          } as any}
        >
          <div className="w-1 h-1 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
        </div>
      ))}

      <style>{`
        @keyframes particle-burst {
          0% { transform: translate(-50%, -50%) translate(0, 0) scale(2); opacity: 1; filter: blur(0px); }
          100% { transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(0); opacity: 0; filter: blur(4px); }
        }
        .animate-particle {
          animation: particle-burst 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>,
    document.body
  );
}

