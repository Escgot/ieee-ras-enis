import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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

gsap.registerPlugin(ScrollTrigger);

/* ── Premium Loading Screen ── */


/* ── Section Divider ── */
function SectionDivider() {
  return (
    <div className="relative w-full h-px overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </div>
  );
}

/* ── Home Page (all sections) ── */
function HomePage() {
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  /* Global scroll-triggered section reveals */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.section-reveal').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 60, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
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
  }, [showAllEvents, showAllProjects, showAllProducts]);

  const handleShowAllEvents = () => {
    setShowAllEvents(true);
    setShowAllProjects(false);
    setShowAllProducts(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleShowAllProjects = () => {
    setShowAllProjects(true);
    setShowAllEvents(false);
    setShowAllProducts(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleShowAllProducts = () => {
    setShowAllProducts(true);
    setShowAllEvents(false);
    setShowAllProjects(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToHome = (section: 'events' | 'projects' | 'shop') => {
    setShowAllEvents(false);
    setShowAllProjects(false);
    setShowAllProducts(false);
    setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const isHome = !showAllEvents && !showAllProjects && !showAllProducts;

  return (
    <div ref={mainRef}>
      <CustomCursor />
      <Suspense fallback={<div className="min-h-screen bg-transparent" />}>
        {isHome ? (
          <>
            <Navigation
              onNavigateHome={() => {
                setShowAllEvents(false);
                setShowAllProjects(false);
                setShowAllProducts(false);
                navigate('/');
              }}
            />
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
                <Events onViewAll={handleShowAllEvents} />
              </div>
              <SectionDivider />
              <div className="section-reveal">
                <Projects onViewAll={handleShowAllProjects} />
              </div>
              <SectionDivider />
              <div className="section-reveal">
                <Team />
              </div>
              <SectionDivider />
              <div className="section-reveal">
                <Shop onViewAll={handleShowAllProducts} />
              </div>
              <SectionDivider />
              <div className="section-reveal">
                <Contact />
              </div>
            </main>
            <Footer />
          </>
        ) : showAllEvents ? (
          <AllEvents onBack={() => handleBackToHome('events')} />
        ) : showAllProducts ? (
          <AllProducts onBack={() => handleBackToHome('shop')} />
        ) : (
          <AllProjects onBack={() => handleBackToHome('projects')} />
        )}
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
          <Routes>
            <Route path="/" element={<HomePage />} />
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
