import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TYPEWRITER_TEXTS = ['Robotics', 'Automation', 'Intelligence', 'Engineering'];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
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
        }, 80);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2500);
      }
    } else {
      if (typewriterText.length > 0) {
        timeout = setTimeout(() => {
          setTypewriterText(currentWord.slice(0, typewriterText.length - 1));
        }, 40);
      } else {
        setIsDeleting(false);
        setTypewriterIndex((prev) => (prev + 1) % TYPEWRITER_TEXTS.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [typewriterText, isDeleting, typewriterIndex]);

  // Entrance & Scroll Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Left column items staggered entrance
      if (textColRef.current) {
        const children = textColRef.current.children;
        tl.fromTo(children,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, stagger: 0.15 }
        );
      }

      // Robot entrance and floating
      if (robotRef.current) {
        tl.fromTo(robotRef.current,
          { opacity: 0, x: 100, scale: 1.1 },
          { opacity: 1, x: 0, scale: 1.4, duration: 1.8, ease: 'power4.out' },
          '-=1.2'
        );

        // Continuous floating
        gsap.to(robotRef.current, {
          y: '-=25',
          duration: 4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
      }

      // Parallax scroll fade out
      gsap.to(heroRef.current, {
        scale: 1.05,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent pt-24 lg:py-0">

      {/* Cyber grid */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[90rem] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Text Column */}
          <div ref={textColRef} className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-20">

            {/* ENIT Announcement Badge */}
            <a

              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-6 py-2.5 mb-8 hero-badge bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.1)] hover:border-red-500/50 transition-all duration-300 hover:scale-[1.02]"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded-md bg-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest">New</span>
                <span className="text-xs sm:text-sm text-foreground font-bold tracking-[0.2em] uppercase group-hover:text-red-400 transition-colors">NEXT STATION : ENIM</span>
              </div>
              <ArrowRight className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Massive Title */}
            <h1 className="font-orbitron font-black mb-6 tracking-tighter leading-[0.85] flex flex-col">
              <span className="text-foreground text-[4rem] sm:text-[5.5rem] md:text-[7rem] lg:text-[7.5rem] xl:text-[9rem]">IEEE</span>
              <div className="flex flex-row flex-wrap gap-x-4 sm:gap-x-6 lg:gap-x-8">
                <span className="text-gradient pb-2 text-[4rem] sm:text-[5.5rem] md:text-[7rem] lg:text-[7.5rem] xl:text-[9rem] drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">RAS</span>
                <span className="text-foreground pb-2 text-[4rem] sm:text-[5.5rem] md:text-[7rem] lg:text-[7.5rem] xl:text-[9rem]">ENIS</span>
              </div>
            </h1>

            {/* Typewriter Line */}
            <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-6 mb-8 w-full mt-2">
              <span className="font-orbitron text-2xl sm:text-3xl text-foreground font-black tracking-widest uppercase flex items-center whitespace-nowrap drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                {typewriterText}
                <span className="inline-block w-1.5 h-7 ml-2 bg-red-500 animate-pulse" />
              </span>
              <div className="hidden lg:block h-px flex-1 max-w-[200px] bg-gradient-to-r from-foreground/30 to-transparent" />
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed font-medium">
              Empowering students to innovate, build, and lead in the world of robotics and automation.
            </p>

            {/* Minimalist CTA */}
            <div className="flex justify-center lg:justify-start w-full sm:w-auto mt-8">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }}
                className="group relative flex items-center gap-3 text-foreground dark:text-white font-orbitron font-bold text-xl uppercase tracking-[0.2em] transition-all duration-300"
              >
                <span className="relative">
                  Join Us
                  <span className="absolute -bottom-2 left-0 w-0 h-1 bg-red-500 transition-all duration-500 group-hover:w-full" />
                </span>
                <ArrowRight className="w-6 h-6 text-red-500 group-hover:translate-x-3 transition-transform duration-500 ease-out" />
              </a>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0 z-10 hidden lg:flex items-center justify-center pointer-events-none">
            {/* Ambient Background Glow behind the robot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] bg-gradient-to-br from-red-600/10 to-blue-600/10 blur-[120px] rounded-full" />

            {/* The BIG Robot Image with screen blending mode */}
            <img
              ref={robotRef}
              src="/images/x-robot.png"
              alt="Advanced Robot Node"
              className="relative w-[120%] sm:w-full max-w-[600px] lg:max-w-none lg:w-[145%] h-auto mix-blend-screen mix-blend-lighten z-20 translate-y-0 lg:translate-y-[5%] scale-[1.7]"
              style={{
                filter: 'drop-shadow(0 0 40px rgba(239,68,68,0.25)) contrast(1.1) brightness(1.1)',
                WebkitMaskImage: 'linear-gradient(to top, transparent 5%, black 35%)',
                maskImage: 'linear-gradient(to top, transparent 5%, black 35%)'
              }}
            />
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none z-0" />

      {/* Scroll Indicator */}
      <div className="absolute bottom-0 left-[44%] sm:left-[48%] -translate-x-1/2 animate-bounce z-30 pb-2">
        <a
          href="#about"
          onClick={(e) => { e.preventDefault(); scrollToSection('#about'); }}
          className="flex flex-col items-center gap-2 text-gray-500 hover:text-white transition-colors group"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll</span>
          <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
        </a>
      </div>
    </section>
  );
}
