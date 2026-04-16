import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const tailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; angle: number; speed: number }[]>([]);

  useEffect(() => {
    // Disable on mobile devices for better UX
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (isMobile) return;

    const moveCursor = (e: MouseEvent) => {
      // Main dot follows instantly
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      // Increased Speed: Outer follower tracks closer (0.35s instead of 0.8s)
      gsap.to(followerRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.35,
        ease: 'power3.out'
      });

      // Tail Animation: Staggered trail dots
      tailRefs.current.forEach((dot, index) => {
        if (!dot) return;
        gsap.to(dot, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.45 + (index * 0.15), // Smoothly increasing delay
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    };

    const handleMouseDown = (e: MouseEvent) => {
      gsap.to(cursorRef.current, { scale: 0.8 });
      gsap.to(followerRef.current, { scale: 1.5 });
      tailRefs.current.forEach(dot => gsap.to(dot, { scale: 0.5, opacity: 0.3 }));

      // Create click particle burst
      const burstId = Date.now();
      const newParticles = Array.from({ length: 8 }).map((_, i) => ({
        id: burstId + i,
        x: e.clientX,
        y: e.clientY,
        angle: (i / 8) * Math.PI * 2 + (Math.random() * 0.5),
        speed: 30 + Math.random() * 30
      }));

      setParticles((prev) => [...prev, ...newParticles]);
      
      setTimeout(() => {
        setParticles((prev) => prev.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 1000);
    };

    const handleMouseUp = () => {
      gsap.to(cursorRef.current, { scale: 1 });
      gsap.to(followerRef.current, { scale: 1 });
      tailRefs.current.forEach(dot => gsap.to(dot, { scale: 1, opacity: 0.6 }));
    };

    const handleMouseEnterLink = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      gsap.to(followerRef.current, {
        scale: 2.5,
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        borderColor: 'rgba(239, 68, 68, 0.6)',
        duration: 0.4,
        ease: 'expo.out'
      });
      gsap.to(cursorRef.current, { opacity: 0, duration: 0.2 });
      tailRefs.current.forEach(dot => gsap.to(dot, { opacity: 0, scale: 0.2, duration: 0.2 }));

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
      gsap.to(cursorRef.current, { opacity: 1, duration: 0.2 });
      tailRefs.current.forEach(dot => gsap.to(dot, { opacity: 0.6, scale: 1, duration: 0.3 }));
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
    
    const observer = new MutationObserver(() => {
      addLinkEvents();
    });
    
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
      {/* Main interactive dot */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-red-600 rounded-full z-[1000002] pointer-events-none mix-blend-difference shadow-[0_0_10px_rgba(239,68,68,0.5)]"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      
      {/* Follower ring */}
      <div 
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 border border-black/30 dark:border-white/30 rounded-full z-[1000001] pointer-events-none transition-colors duration-300 flex items-center justify-center text-black dark:text-white"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <div className="absolute inset-0 rounded-full bg-red-500/5 opacity-0 group-hover:opacity-100" />
      </div>

      {/* Trailing Tail Dots */}
      {[...Array(3)].map((_, i) => (
        <div 
          key={i}
          ref={el => tailRefs.current[i] = el}
          className="fixed top-0 left-0 rounded-full z-[1000000] pointer-events-none"
          style={{ 
            width: `${6 - i * 1.5}px`, 
            height: `${6 - i * 1.5}px`,
            backgroundColor: 'rgba(239, 68, 68, 0.6)',
            opacity: 0.6 - (i * 0.15),
            transform: 'translate(-50%, -50%)',
            filter: 'blur(1px)'
          }}
        />
      ))}

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
          <div className="w-1.5 h-1.5 bg-red-500 rounded-sm shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
        </div>
      ))}

      <style>{`
        @keyframes particle-burst {
          0% { transform: translate(-50%, -50%) translate(0, 0) scale(1.5); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(0) rotate(10deg); opacity: 0; }
        }
        .animate-particle {
          animation: particle-burst 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>,
    document.body
  );
}

