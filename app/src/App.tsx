import { useEffect, useRef, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Preloader from './components/Preloader';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import News from './components/News';
import ParticleBackground from './components/ParticleBackground';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Lazy load components that are below the fold and secondary pages
const CustomCursor = lazy(() => import('./components/CustomCursor'));
const Projects = lazy(() => import('./components/Projects'));
const AllProjects = lazy(() => import('./components/AllProjects'));
const Events = lazy(() => import('./components/Events'));
const AllEvents = lazy(() => import('./components/AllEvents'));
const Gallery = lazy(() => import('./components/Gallery'));
const Team = lazy(() => import('./components/Team'));
const Shop = lazy(() => import('./components/Shop'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
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
      <Suspense fallback={<div className="min-h-screen bg-transparent" />}>
        <>
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
          </>
      </Suspense>
    </div>
  );
}

/* ── Main App ── */
function App() {
  const location = useLocation();

  /* Scroll to top on route change */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <>
      <ParticleBackground />
      <Preloader />

      <div className="min-h-screen bg-transparent text-foreground">
        <Suspense fallback={<div className="min-h-screen bg-transparent" />}>
          <CustomCursor />
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
