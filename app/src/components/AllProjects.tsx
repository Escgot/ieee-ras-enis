import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Search, ArrowLeft, ArrowRight, X, Cpu, Settings, Target,
  ChevronLeft, ChevronRight, Zap, CircuitBoard, ExternalLink,
  Activity, Layers, CheckCircle2, Clock
} from 'lucide-react';
import { projects, type Project } from '../data/projects';
import { Dialog, DialogContent } from './ui/dialog';
import {
  motion, AnimatePresence, useScroll, useTransform,
  useSpring, useInView, useMotionValue, type Variants
} from 'framer-motion';
import Navigation from './Navigation';
import Footer from './Footer';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════
   ANIMATION VARIANTS (Framer Motion)
   ═══════════════════════════════════════════════════════ */

const smoothEase = [0.25, 0.4, 0.25, 1] as const;

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85, filter: 'blur(8px)' },
  show: {
    opacity: 1, scale: 1, filter: 'blur(0px)',
    transition: { duration: 0.5, ease: smoothEase },
  },
};

const pillVariant: Variants = {
  hidden: { opacity: 0, scale: 0.7, y: 20 },
  show: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.4, ease: smoothEase },
  },
};

/* ── Card layout animation for grid reflow ── */
const cardLayoutVariant: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  show: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.5, ease: smoothEase },
  },
  exit: {
    opacity: 0, scale: 0.95, y: -20,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as const },
  },
};

/* ═══════════════════════════════════════════════════════
   HELPER COMPONENTS
   ═══════════════════════════════════════════════════════ */

/* ── Character-by-character text reveal ── */
function AnimatedText({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={`inline-block whitespace-nowrap ${className}`} aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          initial={{ opacity: 0, y: 50, rotateX: -60 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.03,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          style={{ display: 'inline-block', transformOrigin: 'bottom' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ── Animated counter with spring ── */
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, isInView]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── Magnetic button (follows cursor within bounds) ── */
function MagneticButton({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 30, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 200, damping: 30, mass: 0.5 });

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  }, [x, y]);

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/* ── Mouse-following glow card ── */
function GlowCard({ 
  children, 
  className = '', 
  onClick,
  'data-cursor-text': cursorText
}: { 
  children: React.ReactNode; 
  className?: string; 
  onClick?: () => void;
  'data-cursor-text'?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current || !glowRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glowRef.current.style.background = `radial-gradient(650px circle at ${x}px ${y}px, rgba(239, 68, 68, 0.07), transparent 40%)`;
    glowRef.current.style.opacity = '1';
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = '0';
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      data-cursor-text={cursorText}
    >
      <div ref={glowRef} className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-700 opacity-0 z-0" />
      {children}
    </div>
  );
}

/* ── Scroll-triggered reveal wrapper ── */
function ScrollReveal({ children, className = '', delay = 0, once = true }: { children: React.ReactNode; className?: string; delay?: number; once?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Parallax wrapper using useScroll ── */
function ParallaxLayer({ children, speed = 0.5, className = '' }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * -100]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div ref={ref} style={{ y: smoothY }} className={className}>
      {children}
    </motion.div>
  );
}


/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function AllProjects() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Projects');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in-progress'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const projectGalleryRef = useRef<HTMLDivElement>(null);

  // Scroll progress for top bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Hero parallax
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroScrollProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 0.95]);
  const smoothHeroY = useSpring(heroY, { stiffness: 100, damping: 30 });

  const scrollGallery = (direction: 'left' | 'right') => {
    if (projectGalleryRef.current) {
      projectGalleryRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth',
      });
    }
  };

  const categories = ['All Projects', 'Autonomous', 'LINE FOLLOWER', 'ALL TERRAIN', 'FIGHTER'];

  // Stats
  const completedCount = projects.filter(p => p.status === 'completed').length;
  const inProgressCount = projects.filter(p => p.status === 'in-progress').length;
  const totalTech = new Set(projects.flatMap(p => p.technologies)).size;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // GSAP: Horizontal scan line & floating decorations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scan line sweep
      gsap.fromTo('.scan-line',
        { top: '-2px', opacity: 1 },
        { top: '100%', opacity: 0, duration: 2.5, ease: 'power1.inOut', delay: 0.3 }
      );

      // Floating decorative elements with parallax
      gsap.to('.float-element-1', {
        y: -80, rotation: 15,
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
      });
      gsap.to('.float-element-2', {
        y: -120, rotation: -20,
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
      });

      // Grid card 3D tilt on hover
      const cards = document.querySelectorAll<HTMLDivElement>('.tilt-card');
      cards.forEach(card => {
        const onMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
          const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
          gsap.to(card, {
            rotateX: y, rotateY: x, transformPerspective: 1000,
            duration: 0.4, ease: 'power2.out',
          });
        };
        const onLeave = () => {
          gsap.to(card, {
            rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out',
          });
        };
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [activeCategory, searchTerm]);

  useEffect(() => {
    if (selectedProject) setActiveImage(selectedProject.image);
    else setActiveImage(null);
  }, [selectedProject]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = activeCategory === 'All Projects' ||
        project.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchTerm, activeCategory, statusFilter]);

  const featuredProject = filteredProjects[0];
  const restProjects = filteredProjects.slice(1);

  return (
    <div ref={sectionRef} className="relative">
      {/* ── Scroll Progress Bar ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500 via-rose-400 to-purple-500 z-[100] origin-left"
        style={{ scaleX }}
      />

      <Navigation />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <motion.div
        ref={heroRef}
        style={{ y: smoothHeroY, opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[90vh] flex flex-col justify-end overflow-hidden pt-20 sm:pt-24 lg:pt-24"
      >
        {/* Scan line */}
        <div className="scan-line absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent z-30 pointer-events-none" />

        {/* Background mesh */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Orbital rings with parallax */}
          <ParallaxLayer speed={-0.3} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] sm:w-[1000px] sm:h-[1000px] opacity-[0.03]">
            <div className="absolute inset-0 border border-red-500 rounded-full animate-rotate-slow" />
            <div className="absolute inset-10 border border-purple-500/50 rounded-full animate-rotate-reverse" />
            <div className="absolute inset-20 border border-red-500/30 rounded-full animate-rotate-slow" style={{ animationDuration: '30s' }} />
            <div className="absolute inset-32 border border-indigo-500/20 rounded-full animate-rotate-reverse" style={{ animationDuration: '40s' }} />
          </ParallaxLayer>

          <div className="absolute inset-0 cyber-grid opacity-[0.02]" />

          {/* Floating decorative */}
          <div className="float-element-1 absolute top-20 right-10 sm:right-24 opacity-[0.05]">
            <CircuitBoard className="w-32 h-32 sm:w-56 sm:h-56 text-red-500" />
          </div>
          <div className="float-element-2 absolute bottom-40 left-10 sm:left-20 opacity-[0.04]">
            <CircuitBoard className="w-24 h-24 sm:w-40 sm:h-40 text-purple-500 rotate-45" />
          </div>

          {/* Accent blobs */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.12, 0.08] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-red-500 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.1, 0.06] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-1/4 left-1/3 w-48 h-48 sm:w-72 sm:h-72 bg-purple-500 rounded-full blur-[100px]"
          />

          {/* Bottom fade */}
          <div className="absolute bottom-0 inset-x-0 h-52 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14 w-full">
          {/* Back button (magnetic) */}
          <MagneticButton
            onClick={() => navigate('/#projects')}
            className="mb-10 sm:mb-14 flex items-center gap-3 text-muted-foreground hover:text-red-500 transition-colors group"
          >
            <div className="p-2.5 bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 rounded-xl group-hover:bg-red-500/10 group-hover:border-red-500/30 transition-all duration-300">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Back to Home</span>
          </MagneticButton>

          {/* Telemetry HUD Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 rounded-xl bg-foreground/[0.02] dark:bg-white/[0.02] border border-foreground/10 dark:border-white/10 backdrop-blur-md text-[10px] font-mono"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-foreground/90 font-bold uppercase tracking-widest">RAS R&D LAB // PROTOCOL_V2.6</span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-muted-foreground uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-red-500" /> ROBOTICS & AUTOMATION SOCIETY</span>
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> ENIS CHAPTER</span>
            </div>
            <div className="flex items-center gap-2 font-numeric text-foreground font-bold">
              <span className="text-red-500 font-mono text-[9px] uppercase tracking-wider">INDEXED RECORDS:</span>
              <span className="px-2 py-0.5 rounded-md bg-foreground/5 dark:bg-white/5 border border-foreground/5 dark:border-white/5">
                {filteredProjects.length.toString().padStart(2, '0')} / {projects.length.toString().padStart(2, '0')}
              </span>
            </div>
          </motion.div>

          {/* Title section */}
          <div className="mb-8 sm:mb-10" style={{ perspective: '1200px' }}>
            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
              className="flex items-center gap-3 mb-5 sm:mb-6"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="h-px bg-gradient-to-r from-red-500 to-transparent"
              />
              <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-red-500 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Innovation & Prototyping Lab
              </span>
            </motion.div>

            {/* Main Title — Character by character */}
            <h1 className="font-display text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-foreground leading-[0.88] uppercase tracking-tight">
              <AnimatedText text="Project" delay={0.3} />
              <br />
              <span className="text-gradient">
                <AnimatedText text="Archive" delay={0.55} />
              </span>
            </h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
              className="mt-6 sm:mt-8 text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed font-medium"
            >
              Explore the full catalogue of our robotics innovations — from autonomous navigators to combat-ready fighters.
            </motion.p>
          </div>

          {/* ── Stats Bar ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10"
          >
            {[
              { icon: Layers, label: 'Total Projects', value: projects.length, suffix: '', color: 'text-red-500', bg: 'from-red-500/5' },
              { icon: CheckCircle2, label: 'Completed', value: completedCount, suffix: '', color: 'text-green-500', bg: 'from-green-500/5' },
              { icon: Clock, label: 'In Progress', value: inProgressCount, suffix: '', color: 'text-yellow-500', bg: 'from-yellow-500/5' },
              { icon: Cpu, label: 'Technologies', value: totalTech, suffix: '+', color: 'text-purple-500', bg: 'from-purple-500/5' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                whileHover={{ y: -4, transition: { duration: 0.3, ease: [0.25, 0.4, 0.25, 1] } }}
                className="relative group p-4 sm:p-5 bg-foreground/[0.02] dark:bg-white/[0.02] border border-foreground/5 dark:border-white/5 rounded-xl hover:border-red-500/20 transition-colors duration-500 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <motion.div whileHover={{ rotate: 10, scale: 1.05 }} transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}>
                    <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color} mb-2 sm:mb-3`} />
                  </motion.div>
                  <div className="font-numeric text-2xl sm:text-3xl font-black text-foreground leading-none mb-1 tracking-tight">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] font-mono">{stat.label}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, x: -40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 1.1 }}
              className="relative w-full sm:w-80 lg:w-96"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects, technologies, robots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-foreground/[0.03] dark:bg-white/[0.03] border border-foreground/10 dark:border-white/10 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-red-500/50 focus:bg-foreground/[0.05] dark:focus:bg-white/[0.05] transition-all text-sm"
              />
              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Category pills with layout animation */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-1"
            >
              {categories.map((cat) => {
                const count = cat === 'All Projects'
                  ? projects.length
                  : projects.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length;
                const isActive = activeCategory === cat;
                return (
                  <motion.button
                    key={cat}
                    variants={pillVariant}
                    onClick={() => setActiveCategory(cat)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className={`relative px-3.5 sm:px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 border flex-shrink-0 whitespace-nowrap flex items-center gap-2 ${
                      isActive
                        ? 'border-red-500 text-white'
                        : 'bg-foreground/5 dark:bg-white/5 border-foreground/10 dark:border-white/10 text-muted-foreground hover:border-red-500/50 hover:text-foreground'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryPill"
                        className="absolute inset-0 bg-red-600 rounded-xl shadow-[0_4px_24px_rgba(239,68,68,0.4)]"
                        transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                    <span className={`relative z-10 text-[9px] font-numeric font-bold px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-foreground/5 dark:bg-white/5 text-muted-foreground'
                    }`}>
                      {count}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Lifecycle Status Filter */}
            <div className="flex items-center gap-1.5 p-1 bg-foreground/[0.03] dark:bg-white/[0.03] border border-foreground/10 dark:border-white/10 rounded-xl shrink-0">
              {(['all', 'completed', 'in-progress'] as const).map((status) => {
                const isSelected = statusFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-2.5 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-foreground/10 dark:bg-white/15 text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {status === 'completed' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                    {status === 'in-progress' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                    {status === 'all' ? 'All Status' : status === 'completed' ? 'Completed' : 'In Dev'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════ FEATURED SPOTLIGHT ═══════════════════ */}
      {featuredProject && (
        <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
          <GlowCard
            data-cursor-text="VIEW"
            className="tilt-card bg-foreground/[0.02] dark:bg-white/[0.02] border border-foreground/5 dark:border-white/5 rounded-xl overflow-hidden cursor-pointer hover:border-red-500/20 transition-colors duration-700 group"
            onClick={() => setSelectedProject(featuredProject)}
          >
            {/* Featured label */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 z-20"
            >
              <span className="px-3 py-1.5 text-[9px] font-black text-amber-300 bg-amber-500/10 backdrop-blur-md border border-amber-500/30 rounded-lg uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                <Activity className="w-3 h-3" />
                Featured
              </span>
            </motion.div>

            <div className="flex flex-col lg:flex-row relative z-10">
              {/* Image */}
              <div className="relative w-full lg:w-[60%] aspect-[16/10] lg:aspect-auto lg:min-h-[480px] overflow-hidden">
                <motion.img
                  src={featuredProject.image}
                  alt={featuredProject.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent lg:hidden" />
                <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/90" />
                <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Badges */}
                <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-10 flex flex-col gap-2">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="px-3 py-1 text-[9px] font-bold text-red-100 bg-red-600 dark:bg-red-600/90 backdrop-blur-md border border-red-500/40 rounded-lg uppercase tracking-wider shadow-lg"
                  >
                    {featuredProject.category}
                  </motion.span>
                </div>

                {/* Ghost number */}
                <span className="absolute -bottom-8 -right-4 font-numeric text-[12rem] sm:text-[16rem] font-black text-foreground/[0.03] group-hover:text-red-500/[0.05] transition-colors duration-1000 select-none leading-none pointer-events-none">
                  {featuredProject.number}
                </span>
              </div>

              {/* Content */}
              <div className="relative w-full lg:w-[40%] p-7 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-center -mt-20 lg:mt-0 bg-gradient-to-t from-background via-background to-transparent lg:bg-none">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-4 sm:mb-5"
                >
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em] font-mono">
                    PROTOTYPE // {featuredProject.number}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-red-500/30 to-transparent" />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-foreground mb-5 sm:mb-6 group-hover:text-red-500 transition-colors duration-500 uppercase leading-[1.05] tracking-tight"
                >
                  {featuredProject.title}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-7 sm:mb-8 font-medium opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                >
                  {featuredProject.description}
                </motion.p>

                {/* Tech */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  className="flex flex-wrap gap-2 mb-7 sm:mb-8"
                >
                  {featuredProject.technologies.map(tech => (
                    <motion.span
                      key={tech}
                      variants={pillVariant}
                      whileHover={{ scale: 1.1, borderColor: 'rgba(239,68,68,0.5)' }}
                      className="text-[9px] font-black text-muted-foreground px-3 py-1.5 border border-foreground/5 dark:border-white/5 rounded-lg uppercase tracking-widest bg-foreground/[0.02] dark:bg-white/[0.02] transition-colors"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-4"
                >
                  <MagneticButton
                    className="cyber-btn flex items-center gap-3 px-6 py-3.5 bg-red-500 text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded-lg hover:bg-red-600 transition-all shadow-[0_4px_20px_rgba(239,68,68,0.3)] hover:shadow-[0_8px_30px_rgba(239,68,68,0.5)]"
                  >
                    <span>View Case Study</span>
                    <ArrowRight className="w-4 h-4" />
                  </MagneticButton>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-foreground/5 dark:bg-white/5 border border-foreground/5 dark:border-white/5 group-hover:border-red-500/20 group-hover:bg-red-500/10 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-red-400 transition-colors" />
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Bottom glow */}
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-red-500/0 via-red-500/60 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </GlowCard>
        </ScrollReveal>
      )}

      {/* ═══════════════════ PROJECTS GRID ═══════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-32">
        {restProjects.length > 0 && (
          <>
            {/* Section divider */}
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-8 sm:mb-10">
                <div className="h-px flex-1 bg-gradient-to-r from-foreground/10 dark:from-white/10 to-transparent" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">All Innovations</span>
                <div className="h-px flex-1 bg-gradient-to-l from-foreground/10 dark:from-white/10 to-transparent" />
              </div>
            </ScrollReveal>

            {/* Grid with layout animations */}
            <motion.div layout className="projects-grid grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              <AnimatePresence mode="popLayout">
                {restProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    variants={cardLayoutVariant}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    transition={{ delay: index * 0.06 }}
                  >
                    <GlowCard
                      data-cursor-text="VIEW"
                      className="tilt-card h-full bg-foreground/[0.02] dark:bg-white/[0.02] border border-foreground/5 dark:border-white/5 rounded-xl overflow-hidden cursor-pointer hover:border-red-500/20 transition-colors duration-700 group"
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="relative z-10 h-full flex flex-col">
                        {/* Image */}
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <motion.img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
                          <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                          {/* Category badge */}
                          <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-10">
                            <span className="px-3 py-1 text-[9px] font-bold text-red-100 bg-red-600 dark:bg-red-600/90 backdrop-blur-md border border-red-500/40 rounded-md uppercase tracking-wider shadow-lg">
                              {project.category}
                            </span>
                          </div>

                          {/* Status */}
                          <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10">
                            <span className={`px-2.5 py-1 text-[9px] font-bold font-mono uppercase tracking-wider rounded-md border backdrop-blur-md shadow-lg flex items-center gap-1.5 ${
                              project.status === 'completed'
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                                : 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'completed' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                              {project.status === 'completed' ? 'Ready' : 'In Dev'}
                            </span>
                          </div>

                          {/* Ghost number */}
                          <span className="absolute -bottom-4 -right-2 font-numeric text-[7rem] sm:text-[9rem] font-black text-foreground/[0.03] group-hover:text-red-500/[0.06] transition-colors duration-1000 select-none leading-none pointer-events-none">
                            {project.number}
                          </span>

                          {/* Hover CTA overlay */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                          >
                            <div className="px-6 py-3 bg-red-600 text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-2xl backdrop-blur-md flex items-center gap-2 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                              <span>Explore Specs</span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </motion.div>
                        </div>

                        {/* Content */}
                        <div className="p-6 sm:p-7 -mt-12 relative z-20 bg-gradient-to-t from-background via-background to-transparent flex-1 flex flex-col">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.25em] font-mono">
                              PROTOTYPE // {project.number}
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-r from-red-500/30 to-transparent" />
                          </div>

                          <h3 className="font-display text-lg sm:text-xl font-black text-foreground mb-3 group-hover:text-red-500 transition-colors duration-500 uppercase leading-[1.1] tracking-tight">
                            {project.title}
                          </h3>

                          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-5 line-clamp-2 font-medium opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                            {project.description}
                          </p>

                          {/* Tech pills */}
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5">
                            {project.technologies.slice(0, 3).map(tech => (
                              <span key={tech} className="text-[8px] font-black text-muted-foreground px-2.5 py-1 border border-foreground/5 dark:border-white/5 rounded-md uppercase tracking-widest group-hover:border-red-500/30 group-hover:text-red-500 dark:group-hover:text-red-300 transition-all duration-500 bg-foreground/[0.02] dark:bg-white/[0.02]">
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="text-[8px] font-black text-muted-foreground/50 px-2 py-1 uppercase tracking-widest">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="mt-auto flex items-center justify-between pt-4 border-t border-foreground/5 dark:border-white/[0.04] group-hover:border-red-500/10 transition-colors">
                            <div className="flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">
                              <span className="relative">
                                View Details
                                <motion.div
                                  className="absolute -bottom-0.5 left-0 h-[1.5px] bg-red-500"
                                  initial={{ width: 0 }}
                                  whileHover={{ width: '100%' }}
                                  transition={{ duration: 0.4 }}
                                />
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-500" />
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.15, rotate: 5 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-foreground/5 dark:bg-white/5 border border-foreground/5 dark:border-white/5 group-hover:border-red-500/20 group-hover:bg-red-500/10 transition-all"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-red-400 transition-colors" />
                            </motion.div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom glow */}
                      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-red-500/0 via-red-500/50 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20" />
                    </GlowCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="py-24 text-center"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 mx-auto mb-6 rounded-xl bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 flex items-center justify-center"
            >
              <Search className="w-8 h-8 text-muted-foreground/50" />
            </motion.div>
            <h3 className="text-xl font-display font-bold text-foreground mb-2">No projects found</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Try adjusting your search term or selecting a different category.
            </p>
            <MagneticButton
              onClick={() => { setSearchTerm(''); setActiveCategory('All Projects'); setStatusFilter('all'); }}
              className="mt-6 px-6 py-2.5 bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-red-600 transition-colors shadow-[0_4px_20px_rgba(239,68,68,0.3)]"
            >
              Reset Filters
            </MagneticButton>
          </motion.div>
        )}
      </div>

      {/* ═══════════════════ PROJECT DETAIL MODAL ═══════════════════ */}
      <AnimatePresence>
        {selectedProject && (
          <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
            <DialogContent className="sm:max-w-6xl w-[95vw] lg:w-[90vw] lg:aspect-[2/1] bg-white dark:bg-[#0c0515]/95 border-black/10 dark:border-red-500/20 backdrop-blur-3xl p-0 overflow-hidden rounded-xl outline-none shadow-[0_0_80px_rgba(0,0,0,0.1)] dark:shadow-[0_0_80px_rgba(239,68,68,0.15)] flex flex-col my-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 15 }}
                transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
                className="relative w-full h-full max-h-[95vh] lg:max-h-none overflow-hidden no-scrollbar flex flex-col lg:flex-row"
              >
                <motion.button
                  onClick={() => setSelectedProject(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute top-4 right-4 z-50 p-2 text-foreground hover:text-red-500 bg-black/5 dark:bg-black/20 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 rounded-lg transition-colors duration-300 backdrop-blur-md"
                >
                  <X className="w-5 h-5" />
                </motion.button>

                {/* Left: Gallery */}
                <div className="w-full lg:w-[60%] h-[350px] sm:h-[450px] lg:h-full relative shrink-0 overflow-hidden bg-[#050505] flex items-center justify-center group/hero">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImage || selectedProject.image}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.1}
                      onDragEnd={(_, info) => {
                        const swipe = info.offset.x;
                        const photos = selectedProject.photos || [selectedProject.image];
                        const idx = photos.indexOf(activeImage || selectedProject.image);
                        if (swipe < -50) setActiveImage(photos[(idx + 1) % photos.length]);
                        else if (swipe > 50) setActiveImage(photos[(idx - 1 + photos.length) % photos.length]);
                      }}
                      className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                    >
                      <img src={activeImage || selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                    </motion.div>
                  </AnimatePresence>

                  {/* Badges */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-6 left-6 z-20 flex flex-col gap-2"
                  >
                    <span className="px-3 py-1 text-[9px] font-black text-red-100 bg-red-600 dark:bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-md uppercase tracking-widest shadow-lg">
                      {selectedProject.category}
                    </span>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/50 dark:bg-black/40 backdrop-blur-md rounded-md border border-black/10 dark:border-white/5 shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[8px] text-gray-200 dark:text-gray-400 font-mono font-bold uppercase tracking-wider">{selectedProject.status}</span>
                    </div>
                  </motion.div>

                  {/* Nav hints */}
                  <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/40 to-transparent pointer-events-none opacity-0 group-hover/hero:opacity-100 transition-opacity flex items-center justify-center">
                    <ChevronLeft className="w-6 h-6 text-white/20" />
                  </div>
                  <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/40 to-transparent pointer-events-none opacity-0 group-hover/hero:opacity-100 transition-opacity flex items-center justify-center">
                    <ChevronRight className="w-6 h-6 text-white/20" />
                  </div>

                  <div className="hidden lg:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-[#0c0515] to-transparent pointer-events-none z-20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0c0515] via-transparent to-transparent lg:hidden pointer-events-none z-20" />
                </div>

                {/* Right: Content */}
                <div className="lg:w-[40%] px-6 pt-6 pb-2 sm:px-10 sm:pt-10 sm:pb-4 lg:px-12 lg:pt-12 lg:pb-4 relative z-10 flex flex-col -mt-20 sm:-mt-28 lg:mt-0 flex-grow bg-gradient-to-t from-white via-white dark:from-[#0c0515] dark:via-[#0c0515] to-transparent lg:bg-none min-h-0 overflow-hidden">
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-4 lg:mb-6 self-start shrink-0">
                    <span className="px-3 py-1.5 border border-red-500/30 text-red-500 dark:text-red-300 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] rounded-md bg-red-500/10 backdrop-blur-md">
                      PROJECT // {selectedProject.category.toUpperCase()}
                    </span>
                  </motion.div>

                  <motion.h2 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="font-display text-xl sm:text-2xl lg:text-3xl font-black text-foreground mb-3 lg:mb-4 leading-tight tracking-tight shrink-0">
                    {selectedProject.title}
                  </motion.h2>

                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4 lg:mb-6 text-xs text-muted-foreground font-medium shrink-0">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-red-600 dark:text-red-500" />
                      <span className="uppercase text-[9px] tracking-widest">{selectedProject.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-red-600 dark:text-red-500" />
                      <span className="uppercase text-[9px] tracking-widest">R&D Phase</span>
                    </div>
                  </motion.div>

                  <div className="h-px w-full bg-black/5 dark:bg-white/5 mb-4 lg:mb-6 shrink-0" />

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="space-y-4 text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4 lg:mb-6 font-medium flex-grow overflow-y-auto min-h-0 pr-4 custom-scrollbar">
                    <p className="text-foreground/90 font-semibold">{selectedProject.description}</p>
                    <label className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest block flex items-center gap-2 mt-6">
                      <Settings className="w-3 h-3 text-red-600 dark:text-red-500" />
                      Integrated Technologies
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedProject.technologies.map((tech, i) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + i * 0.05 }}
                          whileHover={{ scale: 1.1, borderColor: 'rgba(239,68,68,0.6)' }}
                          className="px-3 py-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-[9px] text-muted-foreground dark:text-gray-300 uppercase font-black tracking-widest transition-colors duration-300 cursor-default"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  <div className="h-px w-full bg-black/5 dark:bg-white/5 mb-3 shrink-0" />

                  {/* Thumbnails */}
                  <div className="shrink-0 relative">
                    {selectedProject.photos && selectedProject.photos.length > 0 ? (
                      <div className="relative group/gallery">
                        <button onClick={() => scrollGallery('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-black/70 hover:bg-red-500 text-white rounded-full opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 border border-white/20 -ml-3 backdrop-blur-md">
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <div ref={projectGalleryRef} className="flex flex-row overflow-x-auto gap-2 no-scrollbar snap-x scroll-smooth">
                          {selectedProject.photos.map((photo, idx) => (
                            <motion.div
                              key={idx}
                              onClick={() => setActiveImage(photo)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-16 h-12 sm:w-20 sm:h-14 lg:w-24 lg:h-16 shrink-0 rounded-lg overflow-hidden border border-white/10 cursor-pointer snap-center relative"
                            >
                              <img
                                src={photo}
                                alt={`Gallery ${idx + 1}`}
                                className={`w-full h-full object-cover transition-all duration-500 ${activeImage === photo ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-100'}`}
                              />
                              {activeImage === photo && (
                                <motion.div
                                  layoutId="activeThumb"
                                  className="absolute inset-0 border-2 border-red-500 rounded-md pointer-events-none shadow-[inset_0_0_10px_rgba(239,68,68,0.5)]"
                                  transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                                />
                              )}
                            </motion.div>
                          ))}
                        </div>
                        <button onClick={() => scrollGallery('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-black/70 hover:bg-red-500 text-white rounded-full opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 border border-white/20 -mr-3 backdrop-blur-md">
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
