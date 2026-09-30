import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Compass, ShieldCheck, Terminal } from 'lucide-react';
import { scrollToSectionWithOffset } from '../utils/scroll';

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
        tl.fromTo(
          children,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }
        );
      }

      // Robot entrance and continuous floating
      const robotImages = heroRef.current?.querySelectorAll('.cyber-robot-img');
      if (robotImages && robotImages.length > 0) {
        tl.fromTo(
          robotImages,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 1.4, ease: 'power4.out' },
          '-=0.8'
        );

        gsap.to(robotImages, {
          y: '-=16',
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
    scrollToSectionWithOffset(href);
  };

  return (
    <section
      id="home"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-transparent pt-16 sm:pt-20 lg:pt-24 pb-10 sm:pb-16"
    >
      {/* Background Cyber Ambient Elements */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

      {/* Ambient Lighting Nebulae */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Responsive Grid Container */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[94rem] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">

          {/* ═══════════════════ LEFT COLUMN: EDITORIAL TECH (Full Height on Desktop) ═══════════════════ */}
          <div ref={textColRef} className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-20">

            {/* Announcement Badge */}
            <a
              href="#events"
              onClick={(e) => { e.preventDefault(); scrollToSection('#events'); }}
              aria-label="Next Station ENSI Event Announcement"
              className="opacity-0 group inline-flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-5 py-1.5 sm:py-2 mb-2 sm:mb-3 lg:mb-4 bg-foreground/[0.03] dark:bg-white/[0.04] backdrop-blur-xl border border-foreground/10 dark:border-white/10 rounded-full shadow-[0_4px_24px_rgba(239,68,68,0.12)] hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-300 hover:scale-[1.02]"
            >
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-red-500" />
              </span>
              <div className="flex items-center gap-2">
                <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-red-600 text-white text-[8px] sm:text-[9px] font-numeric font-bold uppercase tracking-widest shadow-sm">
                  NEW
                </span>
                <span className="text-[11px] sm:text-xs md:text-sm text-foreground font-bold tracking-[0.18em] sm:tracking-[0.2em] uppercase group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                  NEXT STATION : ENSI
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Pre-title telemetry line */}
            <div className="opacity-0 flex items-center justify-center lg:justify-start gap-2 text-[8px] xs:text-[9px] sm:text-[11px] font-numeric font-bold tracking-[0.16em] sm:tracking-[0.25em] text-red-500 uppercase mb-1.5 sm:mb-2 lg:mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
              <span>IEEE RAS #61101</span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-muted-foreground">ENIS STUDENT BRANCH</span>
            </div>

            {/* Massive Title - Grand and monumental on desktop, balanced on mobile */}
            <h1 className="opacity-0 font-display font-black mb-2 sm:mb-3 lg:mb-5 tracking-tighter leading-[0.88] flex flex-col uppercase min-h-[75px] xs:min-h-[95px] sm:min-h-[150px] lg:min-h-[190px] xl:min-h-[220px]">
              <span className="text-foreground text-[2.8rem] xs:text-[3.4rem] sm:text-[5.5rem] md:text-[7rem] lg:text-[7.8rem] xl:text-[9.5rem] tracking-tight">
                IEEE
              </span>
              <div className="flex flex-row items-baseline gap-x-2.5 sm:gap-x-5 lg:gap-x-7">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 text-[2.8rem] xs:text-[3.4rem] sm:text-[5.5rem] md:text-[7rem] lg:text-[7.8rem] xl:text-[9.5rem] drop-shadow-[0_0_40px_rgba(239,68,68,0.35)]">
                  RAS
                </span>
                <span className="text-foreground text-[2.8rem] xs:text-[3.4rem] sm:text-[5.5rem] md:text-[7rem] lg:text-[7.8rem] xl:text-[9.5rem]">
                  ENIS
                </span>
              </div>
            </h1>

            {/* MOBILE-ONLY 3D ROBOT CENTERPIECE (Visible on mobile / Hidden on desktop) */}
            <div className="block lg:hidden w-full my-1.5 sm:my-3">
              <div className="relative w-full min-h-[225px] xs:min-h-[255px] sm:min-h-[310px] max-w-[290px] xs:max-w-[335px] sm:max-w-[410px] mx-auto flex items-center justify-center py-2 sm:py-4">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[135%] h-[135%] bg-gradient-to-br from-red-600/15 via-rose-600/10 to-blue-600/10 blur-[65px] rounded-full pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[230px] xs:w-[275px] sm:w-[345px] h-[230px] xs:h-[275px] sm:h-[345px] rounded-full border border-dashed border-red-500/20 animate-[spin_60s_linear_infinite] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[175px] xs:w-[210px] sm:w-[260px] h-[175px] xs:h-[210px] sm:h-[260px] rounded-full border border-red-500/10 pointer-events-none" />
                <img
                  src="/images/x-robot.webp"
                  alt=""
                  aria-hidden="true"
                  width="440"
                  height="593"
                  className="cyber-robot-img opacity-0 relative w-[88%] xs:w-[94%] sm:w-[102%] h-auto mix-blend-screen mix-blend-lighten z-20 pointer-events-none select-none scale-[1.06] xs:scale-[1.10] sm:scale-[1.14]"
                  style={{
                    aspectRatio: '440 / 593',
                    filter: 'drop-shadow(0 0 35px rgba(239,68,68,0.32)) contrast(1.12) brightness(1.12)',
                    WebkitMaskImage: 'linear-gradient(to top, transparent 3%, black 25%)',
                    maskImage: 'linear-gradient(to top, transparent 3%, black 25%)',
                  }}
                />
              </div>
            </div>

            {/* Typewriter Terminal Console - Fixed width bounds to prevent CLS */}
            <div className="opacity-0 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-2.5 sm:mb-4 lg:mb-6 w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-foreground/[0.04] dark:bg-white/[0.04] border border-foreground/10 dark:border-white/10 text-xs sm:text-sm font-numeric w-[280px] xs:w-[310px] sm:w-[380px] lg:w-[410px]">
                <Terminal className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="text-muted-foreground font-medium text-[10px] sm:text-xs shrink-0">INIT //</span>
                <span className="text-foreground font-bold tracking-wider text-xs sm:text-sm flex-1 min-w-0 truncate text-left">
                  {typewriterText}
                </span>
                <span className="inline-block w-1.5 h-3.5 bg-red-500 animate-pulse ml-0.5 shrink-0" />
              </div>
              <div className="hidden sm:block h-px flex-1 max-w-[120px] bg-gradient-to-r from-red-500/40 to-transparent" />
            </div>

            {/* Description */}
            <p className="opacity-0 text-xs xs:text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl mb-3 sm:mb-6 lg:mb-8 leading-relaxed font-sans font-medium line-clamp-2 sm:line-clamp-none">
              Pioneering intelligent robotics, autonomous systems, and hands-on engineering excellence. Where ambitious Tunisian engineers transform visionary concepts into breakthrough prototypes.
            </p>

            {/* Dual High-Tech Action CTAs */}
            <div className="opacity-0 flex flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-4 w-full sm:w-auto">
              {/* Primary: Explore Innovations */}
              <a
                href="#projects"
                onClick={(e) => { e.preventDefault(); scrollToSection('#projects'); }}
                className="flex-1 sm:flex-initial justify-center group relative inline-flex items-center gap-2 sm:gap-3 px-4 xs:px-6 sm:px-7 py-2.5 sm:py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-numeric text-[10px] xs:text-xs font-bold uppercase tracking-wider sm:tracking-widest rounded-xl shadow-[0_8px_30px_rgba(239,68,68,0.35)] hover:shadow-[0_10px_35px_rgba(239,68,68,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden whitespace-nowrap"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90 group-hover:rotate-45 transition-transform duration-500 shrink-0" />
                <span>EXPLORE INNOVATIONS</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:translate-x-1 transition-transform shrink-0" />
              </a>

              {/* Secondary: Join The Chapter */}
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }}
                className="flex-1 sm:flex-initial justify-center group inline-flex items-center gap-2 sm:gap-2.5 px-4 xs:px-5 sm:px-6 py-2.5 sm:py-3.5 bg-foreground/[0.03] dark:bg-white/[0.04] hover:bg-foreground/[0.06] dark:hover:bg-white/[0.08] text-foreground border border-foreground/10 dark:border-white/10 hover:border-red-500/40 rounded-xl font-numeric text-[10px] xs:text-xs font-bold uppercase tracking-wider sm:tracking-widest transition-all duration-300 backdrop-blur-md whitespace-nowrap"
              >
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 shrink-0" />
                <span>JOIN CHAPTER</span>
              </a>
            </div>

          </div>

          {/* ═══════════════════ RIGHT COLUMN: 3D CYBER ROBOT SHOWCASE (Desktop) ═══════════════════ */}
          <div className="hidden lg:flex lg:col-span-5 relative mt-4 lg:mt-0 z-10 items-center justify-center">

            {/* 3D Perspective Wrapper */}
            <div
              ref={robotContainerRef}
              style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
              className="relative w-full min-h-[520px] xl:min-h-[590px] flex items-center justify-center py-6 lg:py-10"
            >

              {/* Ambient Circular Glow Behind Robot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[145%] h-[145%] bg-gradient-to-br from-red-600/15 via-rose-600/10 to-blue-600/10 blur-[105px] rounded-full pointer-events-none" />

              {/* Cyber Concentric Reticle Rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] xl:w-[510px] h-[400px] xl:h-[510px] rounded-full border border-dashed border-red-500/20 animate-[spin_60s_linear_infinite] pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[310px] xl:w-[385px] h-[310px] xl:h-[385px] rounded-full border border-red-500/10 pointer-events-none" />

              {/* The Robot Image - Monumental, majestic scale on desktop */}
              <img
                ref={robotRef}
                src="/images/x-robot.webp"
                alt="IEEE RAS ENIS Autonomous Robotics Node"
                fetchPriority="high"
                loading="eager"
                width="440"
                height="593"
                className="cyber-robot-img opacity-0 relative w-[135%] lg:w-[155%] xl:w-[168%] h-auto mix-blend-screen mix-blend-lighten z-20 translate-y-0 lg:translate-y-[2%] scale-[1.42] lg:scale-[1.52] xl:scale-[1.58] pointer-events-none select-none"
                style={{
                  aspectRatio: '440 / 593',
                  filter: 'drop-shadow(0 0 50px rgba(239,68,68,0.32)) contrast(1.12) brightness(1.12)',
                  WebkitMaskImage: 'linear-gradient(to top, transparent 4%, black 30%)',
                  maskImage: 'linear-gradient(to top, transparent 4%, black 30%)',
                }}
              />

            </div>

          </div>

        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none z-10" />

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-30">
        <a
          href="#about"
          onClick={(e) => { e.preventDefault(); scrollToSection('#about'); }}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-red-500 transition-colors group cursor-pointer"
        >
          <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] font-numeric font-bold">
            SCROLL TO EXPLORE
          </span>
          <div className="w-4 h-7 sm:w-5 sm:h-8 rounded-full border border-foreground/20 dark:border-white/20 group-hover:border-red-500/60 flex items-start justify-center p-1 transition-colors">
            <div className="w-1 h-2 bg-red-500 rounded-full animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
}
