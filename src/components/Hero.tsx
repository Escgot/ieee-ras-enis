import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TYPEWRITER_TEXTS = ['Robotics', 'Automation', 'Innovation', 'Engineering'];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

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

  // Entrance & Scroll Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(badgeRef.current,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8 }
      )
      .fromTo(titleRef.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1.2 },
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
      );

      // Scroll-driven content zoom
      gsap.to(heroRef.current, {
        scale: 1.1,
        opacity: 0.5,
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
    <section id="home" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent">

      {/* Cyber grid */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none" />

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
