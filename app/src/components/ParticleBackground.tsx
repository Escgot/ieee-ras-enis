import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    interface Particle {
      x: number; y: number; z: number;
      vx: number; vy: number; vz: number;
      baseRadius: number; color: string;
      opacity: number;
    }

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 30 : 200;
    const particles: Particle[] = [];

    const isDark = document.documentElement.classList.contains('dark');

    const initParticles = () => {
      for (let i = 0; i < particleCount; i++) {
        const color = Math.random() > 0.7 
          ? '#ef4444' 
          : Math.random() > 0.5 
            ? '#a855f7' 
            : isDark ? '#ffffff' : '#1a1a1a';

        particles.push({
          x: (Math.random() - 0.5) * width * 2,
          y: (Math.random() - 0.5) * height * 2,
          z: Math.random() * 1000,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          vz: (Math.random() - 0.5) * 0.1,
          baseRadius: Math.random() * 1.5 + 0.5,
          color,
          opacity: isDark ? (Math.random() * 0.5 + 0.2) : (Math.random() * 0.3 + 0.1),
        });
      }
    };

    initParticles();

    let scrollY = 0;
    let lerpedScrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      lerpedScrollY += (scrollY - lerpedScrollY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const fov = 400;
      const centerX = width / 2;
      const centerY = height / 2;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.z <= 0) p.z = 1000;
        if (p.z > 1000) p.z = 0;

        // Effective Z moves with scroll to create "flying through" effect
        const effectiveZ = (p.z - lerpedScrollY * 0.5) % 1000;
        const normalizedZ = effectiveZ < 0 ? effectiveZ + 1000 : effectiveZ;

        const scale = fov / (fov + normalizedZ);
        const screenX = centerX + p.x * scale;
        const screenY = centerY + p.y * scale;

        let alpha = p.opacity;
        if (normalizedZ < 100) alpha *= (normalizedZ / 100);
        if (normalizedZ > 700) alpha *= (1 - (normalizedZ - 700) / 300);

        const radius = p.baseRadius * scale * 2;

        if (screenX > 0 && screenX < width && screenY > 0 && screenY < height) {
          ctx.beginPath();
          ctx.arc(screenX, screenY, Math.max(0.1, radius), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, alpha);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1.0;
    };

    animate();
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
