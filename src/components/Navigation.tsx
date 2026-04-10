import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthButton from './AuthButton';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'News', href: '#news' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Events', href: '#events' },
  { name: 'Projects', href: '#projects' },
  { name: 'Team', href: '#team' },
  { name: 'Shop', href: '#shop' },
  { name: 'Contact', href: '#contact' },
];

export default function Navigation({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section via IntersectionObserver (only on home page)
  useEffect(() => {
    if (!isHomePage) return;

    const observers: IntersectionObserver[] = [];
    const sections = navLinks.map(l => l.href.slice(1));

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [isHomePage]);

  // Move sliding underline indicator (only on home page)
  useEffect(() => {
    if (!isHomePage) return;
    const activeLink = linkRefs.current.get(activeSection);
    const nav = navRef.current;
    if (!activeLink || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    setIndicatorStyle({
      left: linkRect.left - navRect.left,
      width: linkRect.width,
      opacity: 1,
    });
  }, [activeSection, isHomePage]);

  const scrollToSection = (href: string) => {
    if (!isHomePage) {
      // Navigate to home first, then scroll
      navigate('/');
      if (onNavigateHome) onNavigateHome();
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } else if (onNavigateHome) {
      onNavigateHome();
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
            ? 'bg-[#0a0a0a]/85 backdrop-blur-xl border-b border-white/8 shadow-2xl'
            : 'bg-transparent'
          }`}
      >
        {/* Gradient line at bottom of nav when scrolled */}
        {isScrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
        )}

        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-14 lg:h-16">

            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}
              className="flex items-center group"
            >
              <div className="relative h-10 w-32 sm:w-40 flex items-center justify-start flex-shrink-0">
                <img src="/images/ras.webp" alt="RAS Logo" className="relative h-9 w-auto object-contain" />
              </div>
            </a>

            {/* Desktop Navigation */}
            <div ref={navRef} className="hidden lg:flex items-center gap-1 relative">
              {/* Sliding indicator */}
              {isHomePage && (
                <div
                  className="absolute bottom-0 h-0.5 bg-gradient-to-r from-red-500 to-purple-500 rounded-full transition-all duration-400 ease-out pointer-events-none"
                  style={{
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                    opacity: indicatorStyle.opacity,
                    transform: 'translateY(0)',
                  }}
                />
              )}

              {navLinks.map((link) => {
                const sectionId = link.href.slice(1);
                const isActive = isHomePage && activeSection === sectionId;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    ref={(el) => { if (el) linkRefs.current.set(sectionId, el); }}
                    onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                    className={`nav-link relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${isActive
                        ? 'text-white bg-white/5'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {link.name}
                  </a>
                );
              })}
            </div>

            {/* CTA + Auth + Mobile */}
            <div className="flex items-center gap-3">
              {/* Auth Button */}
              <AuthButton />

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 text-white hover:bg-white/10 rounded-lg transition-colors border border-white/10"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen
                  ? <X className="w-5 h-5" />
                  : <Menu className="w-5 h-5" />
                }
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
      >
        <div
          className="absolute inset-0 bg-[#070707]/95 backdrop-blur-2xl"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-16 left-0 right-0 border-b border-white/10 transition-transform duration-500 ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
            }`}
          style={{ background: 'rgba(12,12,12,0.98)', backdropFilter: 'blur(24px)' }}
        >
          {/* Top gradient border */}
          <div className="h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

          <div className="px-4 py-6 space-y-1">
            {navLinks.map((link) => {
              const sectionId = link.href.slice(1);
              const isActive = isHomePage && activeSection === sectionId;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 font-medium text-sm ${isActive
                      ? 'text-white bg-red-500/10 border border-red-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {link.name}
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  )}
                </a>
              );
            })}

            <div className="pt-4">
              <AuthButton mobile />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
