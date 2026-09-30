import { useEffect, useRef, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Preloader from './components/Preloader';
import Navigation from './components/Navigation';
import Hero from './components/Hero';

import ParticleBackground from './components/ParticleBackground';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

import CustomCursor from './components/CustomCursor';
import About from './components/About';
import News from './components/News';
import Projects from './components/Projects';
import Events from './components/Events';
import Gallery from './components/Gallery';
import Team from './components/Team';
import Shop from './components/Shop';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { scrollToSectionWithOffset } from './utils/scroll';

// Lazy load secondary route pages
const AllProjects = lazy(() => import('./components/AllProjects'));
const AllEvents = lazy(() => import('./components/AllEvents'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const AllProducts = lazy(() => import('./components/AllProducts'));
const AllNews = lazy(() => import('./components/AllNews'));
const AllGallery = lazy(() => import('./components/AllGallery'));

gsap.registerPlugin(ScrollTrigger);

/* ── Premium Loading Screen ── */


/* ── Section Divider ── */
function SectionDivider() {
  return (
    <div className="relative w-full h-px overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 dark:via-white/8 to-transparent" />
    </div>
  );
}

/* ── Home Page (all sections) ── */
function HomePage() {
  const mainRef = useRef<HTMLDivElement>(null);

  /* Global scroll-triggered section reveals */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.section-reveal').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 95%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Hover Micro-interactions for all .cyber-btn elements
      gsap.utils.toArray<HTMLElement>('.cyber-btn').forEach((btn) => {
        btn.addEventListener('mouseenter', () => {
          gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' });
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef}>
      <Navigation />
      <main>
        <Hero />
        
        <SectionDivider />
        <div className="section-reveal">
          <About />
        </div>
        <SectionDivider />
        <div className="section-reveal">
          <News />
        </div>
        <SectionDivider />
        <div className="section-reveal">
          <Gallery />
        </div>
        <SectionDivider />
        <div className="section-reveal">
          <Events />
        </div>
        <SectionDivider />
        <div className="section-reveal">
          <Projects />
        </div>
        <SectionDivider />
        <div className="section-reveal">
          <Team />
        </div>
        <SectionDivider />
        <div className="section-reveal">
          <Shop />
        </div>
        <SectionDivider />
        <div className="section-reveal">
          <Contact />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

/* ── Main App ── */
function App() {
  const location = useLocation();

  /* Initialize Lenis butter-smooth inertia scrolling */
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
    });

    (window as unknown as { __lenis?: unknown }).__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      delete (window as unknown as { __lenis?: unknown }).__lenis;
    };
  }, []);

  /* Handle scroll to top or hash on route change */
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        scrollToSectionWithOffset(location.hash);
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      <ParticleBackground />
      <Preloader />

      <div className="min-h-screen bg-transparent text-foreground relative z-10">
        <CustomCursor />
        <Suspense fallback={<div className="min-h-screen bg-transparent" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<AllNews />} />
            <Route path="/gallery" element={<AllGallery />} />
            <Route path="/events" element={<AllEvents />} />
            <Route path="/projects" element={<AllProjects />} />
            <Route path="/products" element={<AllProducts />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

export default App;
