import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import AllProjects from './components/AllProjects';
import Events from './components/Events';
import AllEvents from './components/AllEvents';
import News from './components/News';
import Gallery from './components/Gallery';
import Team from './components/Team';
import Shop from './components/Shop';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

/* ── Premium Loading Screen ── */
function LoadingScreen({ done }: { done: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070707] transition-all duration-700 ${
        done ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Cyber grid in loader */}
      <div className="absolute inset-0 cyber-grid opacity-20" />

      {/* Radial glow */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(239,68,68,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Logo mark */}
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Spinning rings */}
          <div
            className="absolute inset-0 rounded-full border border-red-500/30"
            style={{ animation: 'rotate-slow 3s linear infinite' }}
          />
          <div
            className="absolute inset-2 rounded-full border border-purple-500/20"
            style={{ animation: 'rotate-slow 2s linear infinite reverse' }}
          />
          <div className="w-32 h-14 bg-gradient-to-br from-red-600/10 to-purple-600/10 rounded-xl flex items-center justify-center">
            <img src="/images/ras.webp" alt="RAS Logo" className="w-28 h-10 object-contain" />
          </div>
        </div>

        <div className="text-center">
          <p className="font-orbitron font-black text-xl text-white tracking-[0.2em] mb-1">
            RAS <span className="text-gradient">ENIS</span>
          </p>
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.4em]">Loading…</p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-px bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-purple-500 rounded-full"
            style={{
              animation: 'loader-bar 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes loader-bar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}

/* ── Section Divider ── */
function SectionDivider() {
  return (
    <div className="relative w-full h-px overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </div>
  );
}

/* ── Main App ── */
function App() {
  const [loadingDone, setLoadingDone] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  /* Loading sequence */
  useEffect(() => {
    const t1 = setTimeout(() => setLoadingDone(true), 1300);
    const t2 = setTimeout(() => setIsLoaded(true), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  /* Global scroll-triggered section reveals */
  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.section-reveal').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, mainRef);

    return () => ctx.revert();
  }, [isLoaded, showAllEvents, showAllProjects]);

  const handleShowAllEvents = () => {
    setShowAllEvents(true);
    setShowAllProjects(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleShowAllProjects = () => {
    setShowAllProjects(true);
    setShowAllEvents(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToHome = (section: 'events' | 'projects') => {
    setShowAllEvents(false);
    setShowAllProjects(false);
    setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const isHome = !showAllEvents && !showAllProjects;

  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen done={loadingDone} />

      <div
        ref={mainRef}
        className={`min-h-screen bg-[#0a0a0a] text-white transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {isHome ? (
          <>
            <Navigation
              onNavigateHome={() => {
                setShowAllEvents(false);
                setShowAllProjects(false);
              }}
            />
            <main>
              <Hero />
              <SectionDivider />
              <About />
              <SectionDivider />
              <News />
              <SectionDivider />
              <Gallery />
              <SectionDivider />
              <Events onViewAll={handleShowAllEvents} />
              <SectionDivider />
              <Projects onViewAll={handleShowAllProjects} />
              <SectionDivider />
              <Team />
              <SectionDivider />
              <Shop />
              <SectionDivider />
              <Contact />
            </main>
            <Footer />
          </>
        ) : showAllEvents ? (
          <AllEvents onBack={() => handleBackToHome('events')} />
        ) : (
          <AllProjects onBack={() => handleBackToHome('projects')} />
        )}
      </div>
    </>
  );
}

export default App;
