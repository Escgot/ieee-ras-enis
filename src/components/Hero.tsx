import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ChevronDown, Zap, Cpu, RadioTower } from 'lucide-react';

const TYPEWRITER_TEXTS = ['Robotics', 'Automation', 'Innovation', 'Engineering'];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  const [typewriterText, setTypewriterText] = useState('');
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cursor glow effect
  useEffect(() => {
    const glow = cursorGlowRef.current;
    if (!glow) return;
    
    const move = (e: MouseEvent) => {
      gsap.to(glow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: 'power2.out',
      });
    };
    
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // Typewriter Effect
  useEffect(() => {
    const currentWord = TYPEWRITER_TEXTS[typewriterIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (typewriterText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setTypewriterText(currentWord.slice(0, typewriterText.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      if (typewriterText.length > 0) {
        timeout = setTimeout(() => {
          setTypewriterText(currentWord.slice(0, typewriterText.length - 1));
        }, 60);
      } else {
        setIsDeleting(false);
        setTypewriterIndex((prev) => (prev + 1) % TYPEWRITER_TEXTS.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [typewriterText, isDeleting, typewriterIndex]);

  // Neural network canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      radius: number; color: string;
      pulse: number; pulseSpeed: number;
    }

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 40 : 90;
    const connectionDist = isMobile ? 80 : 140;

    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.4),
      vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.4),
      radius: Math.random() * 2 + 0.5,
      color: Math.random() > 0.6 ? 'rgba(239, 68, 68,' : 'rgba(168, 85, 247,',
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
    }));

    let animId: number;
    let frame = 0;

    const animate = () => {
      frame++;
      animId = requestAnimationFrame(animate);
      if (frame % 2 !== 0) return;

      ctx.fillStyle = 'rgba(10, 10, 10, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const alpha = 0.4 + Math.sin(p.pulse) * 0.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + Math.sin(p.pulse) * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color + alpha + ')';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x;
          const dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            const lineAlpha = 0.15 * (1 - dist / connectionDist);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(239, 68, 68, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
    };

    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(badgeRef.current, 
        { opacity: 0, y: 20, scale: 0.9 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.8 }
      )
      .fromTo(titleRef.current,
        { opacity: 0, y: 80, rotateX: 35 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1.2 },
        '-=0.4'
      )
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6'
      )
      .fromTo(ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.4'
      )
      .fromTo(statsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.3'
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Cursor Glow (desktop only) */}
      <div
        ref={cursorGlowRef}
        className="cursor-glow hidden sm:block"
        style={{ left: 0, top: 0 }}
      />

      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'linear-gradient(135deg, #070707 0%, #0d0d0d 50%, #080808 100%)' }}
      />

      {/* Aurora blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(239,68,68,0.12) 0%, transparent 70%)', filter: 'blur(40px)', transform: 'translate(-20%, -20%)' }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.1) 0%, transparent 70%)', filter: 'blur(40px)', transform: 'translate(20%, 20%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(ellipse, rgba(239,68,68,0.06) 0%, transparent 60%)', filter: 'blur(60px)' }} />

      {/* Cyber grid */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none" />

      {/* Floating 3D Tech Elements */}
      <div className="absolute right-8 top-1/4 hidden xl:block animate-float-slow" style={{ animationDelay: '0s' }}>
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Outer rings */}
          <div className="absolute inset-0 rounded-full border border-red-500/20 animate-rotate-slow" />
          <div className="absolute inset-2 rounded-full border border-purple-500/20 animate-rotate-reverse" />
          <div className="w-10 h-10 flex items-center justify-center bg-red-500/10 rounded-full border border-red-500/30 backdrop-blur-sm">
            <Cpu className="w-5 h-5 text-red-500" />
          </div>
        </div>
      </div>

      <div className="absolute left-8 bottom-1/3 hidden xl:block animate-float" style={{ animationDelay: '2s' }}>
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-rotate-slow" style={{ animationDuration: '15s' }} />
          <div className="w-8 h-8 flex items-center justify-center bg-purple-500/10 rounded-full border border-purple-500/30 backdrop-blur-sm">
            <RadioTower className="w-4 h-4 text-purple-400" />
          </div>
        </div>
      </div>

      <div className="absolute right-24 bottom-1/4 hidden xl:block animate-float" style={{ animationDelay: '1s' }}>
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-red-500/15 animate-rotate-reverse" />
          <div className="w-6 h-6 flex items-center justify-center bg-red-500/10 rounded-full border border-red-500/25 backdrop-blur-sm">
            <Zap className="w-3 h-3 text-red-400" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-6">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <div ref={badgeRef} className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 hero-badge bg-white/5 backdrop-blur-md border border-white/10 rounded-full animate-pulse-glow">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-sm text-gray-300 font-medium tracking-wide">IEEE Student Branch · RAS Chapter</span>
          </div>

          {/* Main Title */}
          <h1
            ref={titleRef}
            className="font-orbitron text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tight leading-none"
            style={{ perspective: '1000px' }}
          >
            <span className="block text-white mb-2">IEEE RAS</span>
            <span className="block text-gradient">ENIS</span>
          </h1>

          {/* Typewriter Line */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-red-500/50" />
            <span className="font-orbitron text-lg sm:text-xl text-red-400 font-semibold tracking-widest min-w-[200px] text-center">
              {typewriterText}
              <span className="inline-block w-0.5 h-5 ml-1 -mb-0.5 bg-red-500 animate-pulse" />
            </span>
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-red-500/50" />
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-6 leading-relaxed"
          >
            Empowering students to innovate, build, and lead in the world of robotics and automation.
            Building the future —{' '}
            <span className="text-white/80 font-medium">one circuit at a time.</span>
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-row items-center justify-center gap-3 sm:gap-5 mb-8">
            <a
              href="#membership"
              onClick={(e) => { e.preventDefault(); scrollToSection('#membership'); }}
              className="group relative cyber-btn flex items-center justify-center gap-2.5 sm:gap-3 px-6 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-rose-400 text-white font-bold text-xs sm:text-lg rounded-xl transition-all duration-300 shadow-lg shadow-red-600/30 hover:shadow-red-500/50 hover:scale-[1.03] whitespace-nowrap min-w-[140px] sm:min-w-0"
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              Get Membership
            </a>
            <a
              href="#about"
              onClick={(e) => { e.preventDefault(); scrollToSection('#about'); }}
              className="group cyber-btn flex items-center justify-center gap-2 sm:gap-3 px-6 py-4 sm:px-10 sm:py-5 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/15 hover:border-white/30 text-white font-semibold text-xs sm:text-lg rounded-xl transition-all duration-300 hover:scale-[1.03] whitespace-nowrap min-w-[100px] sm:min-w-0"
            >
              Explore
            </a>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a
          href="#about"
          onClick={(e) => { e.preventDefault(); scrollToSection('#about'); }}
          className="flex flex-col items-center gap-2 text-gray-600 hover:text-red-400 transition-colors group"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-red-500 rounded-full animate-bounce" />
          </div>
          <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
        </a>
      </div>
    </section>
  );
}
