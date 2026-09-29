import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Compass, ShieldCheck, Terminal } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TYPEWRITER_TEXTS = [
  'Autonomous Systems',
  'Intelligent Robotics',
  'Embedded IoT & Hardware',
  'Computer Vision & AI',
  'Competitive Engineering',
];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const robotContainerRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLImageElement>(null);

  const [typewriterText, setTypewriterText] = useState('');
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter Effect
  useEffect(() => {
    const currentWord = TYPEWRITER_TEXTS[typewriterIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (typewriterText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setTypewriterText(currentWord.slice(0, typewriterText.length + 1));
        }, 70);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2400);
      }
    } else {
      if (typewriterText.length > 0) {
        timeout = setTimeout(() => {
          setTypewriterText(currentWord.slice(0, typewriterText.length - 1));
        }, 35);
      } else {
        setIsDeleting(false);
        setTypewriterIndex((prev) => (prev + 1) % TYPEWRITER_TEXTS.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [typewriterText, isDeleting, typewriterIndex]);

  // Interactive 3D mouse parallax tracking
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const normX = (x / rect.width - 0.5) * 2; // -1 to 1
    const normY = (y / rect.height - 0.5) * 2; // -1 to 1

    if (robotContainerRef.current) {
      gsap.to(robotContainerRef.current, {
        rotateY: normX * 10,
        rotateX: -normY * 10,
        x: normX * 12,
        y: normY * 12,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (robotContainerRef.current) {
      gsap.to(robotContainerRef.current, {
        rotateY: 0,
        rotateX: 0,
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
    }
  }, []);

  // Entrance & Scroll Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Left column items staggered entrance
      if (textColRef.current) {
        const children = textColRef.current.children;
        tl.fromTo(children,
          { opacity: 0, y: 40, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.12 }
        );
      }

      // Robot entrance and floating
      if (robotRef.current) {
        tl.fromTo(robotRef.current,
          { opacity: 0, x: 80, scale: 1.1 },
          { opacity: 1, x: 0, scale: 1.45, duration: 1.6, ease: 'power4.out' },
          '-=1.0'
        );

        // Continuous smooth organic floating
        gsap.to(robotRef.current, {
          y: '-=20',
          duration: 3.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }

      // Parallax scroll fade out
      gsap.to(heroRef.current, {
        scale: 1.03,
        opacity: 0.05,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-transparent pt-20 sm:pt-24 lg:pt-24 pb-12 sm:pb-16"
    >
      {/* Background Cyber Ambient Elements */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

      {/* Ambient Lighting Nebulae */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[92rem] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* ═══════════════════ LEFT COLUMN: EDITORIAL TECH ═══════════════════ */}
          <div ref={textColRef} className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-20">

            {/* Announcement Badge */}
            <a
              href="#events"
              onClick={(e) => { e.preventDefault(); scrollToSection('#events'); }}
              aria-label="Next Station ENIM Event Announcement"
              className="opacity-0 group inline-flex items-center gap-3 px-4 sm:px-5 py-2 mb-3 sm:mb-4 bg-foreground/[0.03] dark:bg-white/[0.04] backdrop-blur-xl border border-foreground/10 dark:border-white/10 rounded-full shadow-[0_4px_24px_rgba(239,68,68,0.12)] hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-300 hover:scale-[1.02]"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-red-500 text-white text-[9px] font-numeric font-bold uppercase tracking-widest shadow-sm">
                  NEW
                </span>
                <span className="text-xs sm:text-sm text-foreground font-bold tracking-[0.2em] uppercase group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                  NEXT STATION : ENIM
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Pre-title telemetry line */}
            <div className="opacity-0 flex items-center justify-center lg:justify-start gap-2 sm:gap-2.5 text-[9px] sm:text-[11px] font-numeric font-bold tracking-[0.18em] sm:tracking-[0.25em] text-red-500 uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
              <span>IEEE RAS #61101</span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-muted-foreground">ENIS STUDENT BRANCH</span>
            </div>

            {/* Massive Title */}
            <h1 className="opacity-0 font-display font-black mb-3 sm:mb-4 tracking-tighter leading-[0.88] flex flex-col uppercase">
              <span className="text-foreground text-[3.8rem] xs:text-[4.2rem] sm:text-[6rem] md:text-[7.5rem] lg:text-[7.8rem] xl:text-[9.5rem] tracking-tight">
                IEEE
              </span>
              <div className="flex flex-row flex-wrap items-baseline gap-x-3 sm:gap-x-6 lg:gap-x-8">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 text-[3.8rem] xs:text-[4.2rem] sm:text-[6rem] md:text-[7.5rem] lg:text-[7.8rem] xl:text-[9.5rem] drop-shadow-[0_0_40px_rgba(239,68,68,0.35)]">
                  RAS
                </span>
                <span className="text-foreground text-[3.8rem] xs:text-[4.2rem] sm:text-[6rem] md:text-[7.5rem] lg:text-[7.8rem] xl:text-[9.5rem]">
                  ENIS
                </span>
              </div>
            </h1>

            {/* Typewriter Terminal Console */}
            <div className="opacity-0 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-4 mb-6 sm:mb-8 w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-foreground/[0.04] dark:bg-white/[0.04] border border-foreground/10 dark:border-white/10 text-xs sm:text-sm font-numeric max-w-full">
                <Terminal className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="text-muted-foreground font-medium text-[11px] sm:text-xs shrink-0">INIT //</span>
                <span className="text-foreground font-bold tracking-wider text-xs sm:text-sm min-w-0 max-w-[200px] xs:max-w-[240px] sm:max-w-none sm:min-w-[340px] truncate inline-block">
                  {typewriterText}
                </span>
                <span className="inline-block w-1.5 h-4 bg-red-500 animate-pulse ml-0.5 shrink-0" />
              </div>
              <div className="hidden sm:block h-px flex-1 max-w-[120px] bg-gradient-to-r from-red-500/40 to-transparent" />
            </div>

            {/* Description */}
            <p className="opacity-0 text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl mb-8 sm:mb-10 leading-relaxed font-sans font-medium">
              Pioneering intelligent robotics, autonomous systems, and hands-on engineering excellence. Where ambitious Tunisian engineers transform visionary concepts into breakthrough prototypes.
            </p>

            {/* Dual High-Tech Action CTAs */}
            <div className="opacity-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto">
              {/* Primary: Explore Innovations */}
              <a
                href="#projects"
                onClick={(e) => { e.preventDefault(); scrollToSection('#projects'); }}
                className="w-full sm:w-auto justify-center group relative inline-flex items-center gap-3 px-7 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-numeric text-xs font-bold uppercase tracking-widest rounded-xl shadow-[0_8px_30px_rgba(239,68,68,0.35)] hover:shadow-[0_10px_35px_rgba(239,68,68,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <Compass className="w-4 h-4 text-white/90 group-hover:rotate-45 transition-transform duration-500" />
                <span>EXPLORE INNOVATIONS</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Secondary: Join The Chapter */}
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }}
                className="w-full sm:w-auto justify-center group inline-flex items-center gap-2.5 px-6 py-3.5 bg-foreground/[0.03] dark:bg-white/[0.04] hover:bg-foreground/[0.06] dark:hover:bg-white/[0.08] text-foreground border border-foreground/10 dark:border-white/10 hover:border-red-500/40 rounded-xl font-numeric text-xs font-bold uppercase tracking-widest transition-all duration-300 backdrop-blur-md"
              >
                <ShieldCheck className="w-4 h-4 text-red-500" />
                <span>JOIN CHAPTER</span>
              </a>
            </div>

          </div>

          {/* ═══════════════════ RIGHT COLUMN: 3D CYBER ROBOT SHOWCASE ═══════════════════ */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0 z-10 flex items-center justify-center">

            {/* 3D Perspective Wrapper */}
            <div
              ref={robotContainerRef}
              style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
              className="relative w-full max-w-[500px] sm:max-w-[550px] lg:max-w-none flex items-center justify-center py-6 sm:py-10"
            >

              {/* Ambient Circular Glow Behind Robot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-br from-red-600/15 via-rose-600/10 to-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

              {/* Cyber Concentric Reticle Rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[420px] lg:w-[480px] h-[340px] sm:h-[420px] lg:h-[480px] rounded-full border border-dashed border-red-500/20 animate-[spin_60s_linear_infinite] pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[320px] lg:w-[360px] h-[260px] sm:h-[320px] lg:h-[360px] rounded-full border border-red-500/10 pointer-events-none" />

              {/* The Robot Image with crisp contrast and screen blending */}
              <img
                ref={robotRef}
                src="/images/x-robot.webp"
                alt="IEEE RAS ENIS Autonomous Robotics Node"
                fetchPriority="high"
                loading="eager"
                width="440"
                height="593"
                className="opacity-0 relative w-[110%] sm:w-[125%] lg:w-[145%] h-auto mix-blend-screen mix-blend-lighten z-20 translate-y-0 lg:translate-y-[4%] scale-[1.35] sm:scale-[1.45] pointer-events-none select-none"
                style={{
                  filter: 'drop-shadow(0 0 45px rgba(239,68,68,0.3)) contrast(1.12) brightness(1.12)',
                  WebkitMaskImage: 'linear-gradient(to top, transparent 4%, black 30%)',
                  maskImage: 'linear-gradient(to top, transparent 4%, black 30%)',
                }}
              />

            </div>

          </div>

        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none z-10" />

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
        <a
          href="#about"
          onClick={(e) => { e.preventDefault(); scrollToSection('#about'); }}
          className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-red-500 transition-colors group cursor-pointer"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] font-numeric font-bold">
            SCROLL TO EXPLORE
          </span>
          <div className="w-5 h-8 rounded-full border border-foreground/20 dark:border-white/20 group-hover:border-red-500/60 flex items-start justify-center p-1 transition-colors">
            <div className="w-1 h-2 bg-red-500 rounded-full animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
}
