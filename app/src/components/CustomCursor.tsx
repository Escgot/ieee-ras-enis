import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';

type CursorMode = 'default' | 'pointer' | 'text' | 'action' | 'grab';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [actionText, setActionText] = useState<string | null>(null);
  const [isDown, setIsDown] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  const location = useLocation();

  // Mouse physics coordinates (kept in refs for 0ms latency & no react re-renders on move)
  const targetPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const lastTime = useRef(performance.now());
  const rafId = useRef<number | null>(null);
  const isVisible = useRef(false);
  const modeRef = useRef<CursorMode>('default');

  // Keep modeRef in sync
  useEffect(() => {
    modeRef.current = cursorMode;
  }, [cursorMode]);

  // Reset states on route change
  useEffect(() => {
    setCursorMode('default');
    setActionText(null);
    setIsDown(false);
  }, [location.pathname]);

  // Check if device supports fine pointer (mouse / trackpad) and not touch
  useEffect(() => {
    const media = window.matchMedia('(pointer: fine) and (hover: hover)');
    const updateSupport = () => {
      const supported = media.matches && !('ontouchstart' in window && window.innerWidth <= 768);
      setIsSupported(supported);
      if (supported) {
        document.body.classList.add('has-custom-cursor');
      } else {
        document.body.classList.remove('has-custom-cursor');
      }
    };

    updateSupport();
    media.addEventListener?.('change', updateSupport);

    return () => {
      media.removeEventListener?.('change', updateSupport);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  // RAF loop for buttery-smooth, framerate-independent lerp
  const loop = useCallback((currentTime: number) => {
    if (!isVisible.current) {
      rafId.current = requestAnimationFrame(loop);
      return;
    }

    const dt = Math.min((currentTime - lastTime.current) / 1000, 0.1);
    lastTime.current = currentTime;

    // Responsive exponential smoothing factor (higher = tighter follow, 0 lag)
    const currentMode = modeRef.current;
    const speed = currentMode === 'pointer' ? 24 : currentMode === 'action' ? 20 : 18;
    const factor = 1 - Math.exp(-speed * dt);

    ringPos.current.x += (targetPos.current.x - ringPos.current.x) * factor;
    ringPos.current.y += (targetPos.current.y - ringPos.current.y) * factor;

    if (ringRef.current) {
      ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
    }

    rafId.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    lastTime.current = performance.now();
    rafId.current = requestAnimationFrame(loop);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isSupported, loop]);

  // High-frequency pointer tracking & event delegation
  useEffect(() => {
    if (!isSupported) return;

    const handlePointerMove = (e: PointerEvent) => {
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;

      if (!isVisible.current) {
        isVisible.current = true;
        ringPos.current.x = e.clientX;
        ringPos.current.y = e.clientY;
      }

      if (containerRef.current && containerRef.current.style.opacity !== '1') {
        containerRef.current.style.opacity = '1';
      }

      // ZERO LATENCY: Update the core dot position instantly via hardware transform
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    // Smart event delegation: detect element types under pointer
    const handlePointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Text input / selectable fields
      if (target.closest('input, textarea, select, [contenteditable="true"]')) {
        setCursorMode('text');
        setActionText(null);
        return;
      }

      // 2. Custom action text (e.g. data-cursor-text="VIEW")
      const actionEl = target.closest('[data-cursor-text]') as HTMLElement | null;
      if (actionEl) {
        const text = actionEl.getAttribute('data-cursor-text');
        if (text) {
          setActionText(text);
          setCursorMode('action');
          return;
        }
      }

      // 3. Draggable / grab elements
      const isGrab = 
        target.closest('.cursor-grab, [data-cursor="grab"], .cursor-grabbing') ||
        target.style?.cursor?.includes('grab') ||
        target.parentElement?.style?.cursor?.includes('grab');
      if (isGrab) {
        setActionText('DRAG');
        setCursorMode('grab');
        return;
      }

      // 4. Interactive clickable elements
      const clickable = target.closest(
        'a, button, [role="button"], .cursor-pointer, summary, label[for], .cyber-btn, [data-cursor="pointer"]'
      );
      if (clickable) {
        setCursorMode('pointer');
        setActionText(null);
        return;
      }

      // 5. Default background/regular content
      setCursorMode('default');
      setActionText(null);
    };

    const handlePointerOut = (e: PointerEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (!related || !related.closest('a, button, [role="button"], .cursor-pointer, summary, label[for], .cyber-btn, [data-cursor-text], .cursor-grab, [data-cursor="grab"], input, textarea, select')) {
        setCursorMode('default');
        setActionText(null);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button === 0) { // Primary click only
        setIsDown(true);
      }
    };

    const handlePointerUp = () => {
      setIsDown(false);
    };

    const handlePointerLeave = (e: MouseEvent) => {
      if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        if (containerRef.current) {
          containerRef.current.style.opacity = '0';
        }
        isVisible.current = false;
        setIsDown(false);
      }
    };

    const handlePointerEnter = () => {
      if (containerRef.current) {
        containerRef.current.style.opacity = '1';
      }
      isVisible.current = true;
    };

    const handleWindowFocus = () => {
      if (containerRef.current) {
        containerRef.current.style.opacity = '1';
      }
      isVisible.current = true;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerover', handlePointerOver, { passive: true });
    window.addEventListener('pointerout', handlePointerOut, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('contextmenu', handlePointerUp);
    document.addEventListener('mouseleave', handlePointerLeave);
    document.addEventListener('mouseenter', handlePointerEnter);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerover', handlePointerOver);
      window.removeEventListener('pointerout', handlePointerOut);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('contextmenu', handlePointerUp);
      document.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('mouseenter', handlePointerEnter);
    };
  }, [isSupported]);

  if (!isSupported) return null;

  return createPortal(
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden transition-opacity duration-200"
      aria-hidden="true"
    >
      {/* ============================================================ */}
      {/* 1. LEAD DOT: 0ms Latency Hardware Laser Core                */}
      {/* ============================================================ */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 pointer-events-none will-change-transform z-[1000001] flex items-center justify-center transition-[transform,opacity] duration-150 ease-out ${
          cursorMode === 'text'
            ? 'opacity-0 scale-0'
            : cursorMode === 'action' || cursorMode === 'grab'
            ? 'opacity-0 scale-0'
            : isDown
            ? 'opacity-100 scale-75'
            : cursorMode === 'pointer'
            ? 'opacity-100 scale-125'
            : 'opacity-100 scale-100'
        }`}
        style={{ transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }}
      >
        <div className="relative flex items-center justify-center">
          {/* Ambient luminous core */}
          <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_2px_rgba(239,68,68,0.9),0_0_20px_4px_rgba(239,68,68,0.4)]" />
          {/* Specular pinpoint */}
          <div className="absolute w-0.5 h-0.5 rounded-full bg-white opacity-90 pointer-events-none" />
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. SENSOR RETICLE RING: Fluid 120fps Smooth Damped Lerp      */}
      {/* ============================================================ */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 pointer-events-none will-change-transform z-[1000000] flex items-center justify-center transition-[width,height,border-color,background-color,border-radius,box-shadow,opacity] duration-200 ease-out ${
          cursorMode === 'text'
            ? 'w-0 h-0 opacity-0 border-transparent scale-50'
            : cursorMode === 'action' || cursorMode === 'grab'
            ? 'h-8 px-4 rounded-full min-w-[72px] border border-red-500/70 bg-black/85 backdrop-blur-md shadow-[0_0_25px_rgba(239,68,68,0.35)] opacity-100'
            : isDown
            ? 'w-7 h-7 rounded-full border border-red-500 bg-red-500/25 shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-90 opacity-100'
            : cursorMode === 'pointer'
            ? 'w-13 h-13 rounded-full border border-red-500/80 bg-red-500/10 backdrop-blur-[1px] shadow-[0_0_25px_rgba(239,68,68,0.3)] opacity-100'
            : 'w-9 h-9 rounded-full border border-red-500/35 bg-red-500/[0.03] shadow-[0_0_12px_rgba(239,68,68,0.08)] opacity-90'
        }`}
        style={{ transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }}
      >
        {/* ACTION / GRAB BADGE CONTENT */}
        {(cursorMode === 'action' || cursorMode === 'grab') && (
          <span className="text-[10px] font-mono font-bold tracking-widest text-red-400 uppercase select-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
            {actionText || 'DRAG'}
          </span>
        )}

        {/* DEFAULT & POINTER HUD RETICLE NOTCHES */}
        {cursorMode !== 'text' && cursorMode !== 'action' && cursorMode !== 'grab' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Cardinal Micro-Crosshair Notches (Precision Robotic Targeting) */}
            <div
              className={`absolute inset-0 transition-transform duration-700 ease-out ${
                cursorMode === 'pointer' ? 'rotate-45' : 'rotate-0'
              }`}
            >
              {/* North tick */}
              <div
                className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1.5px] transition-all duration-200 ${
                  cursorMode === 'pointer'
                    ? 'h-2 bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                    : 'h-1.5 bg-red-500/60'
                }`}
              />
              {/* South tick */}
              <div
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[1.5px] transition-all duration-200 ${
                  cursorMode === 'pointer'
                    ? 'h-2 bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                    : 'h-1.5 bg-red-500/60'
                }`}
              />
              {/* West tick */}
              <div
                className={`absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[1.5px] transition-all duration-200 ${
                  cursorMode === 'pointer'
                    ? 'w-2 bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                    : 'w-1.5 bg-red-500/60'
                }`}
              />
              {/* East tick */}
              <div
                className={`absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 h-[1.5px] transition-all duration-200 ${
                  cursorMode === 'pointer'
                    ? 'w-2 bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                    : 'w-1.5 bg-red-500/60'
                }`}
              />
            </div>

            {/* Subtle concentric inner radar ring when hovering */}
            {cursorMode === 'pointer' && (
              <div className="w-6 h-6 rounded-full border border-red-500/30 animate-ping opacity-30 pointer-events-none" />
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
