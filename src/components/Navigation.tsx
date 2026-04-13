import { useState, useEffect, useRef } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
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
  const { theme, setTheme } = useTheme();

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
      <div className={`fixed top-2 sm:top-6 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 transition-all duration-700 ease-out ${isScrolled ? 'translate-y-0' : 'translate-y-[-4px]'}`}>
        <nav
          className={`w-full max-w-7xl rounded-2xl lg:rounded-full transition-all duration-500 border ${isScrolled
            ? 'bg-white/80 dark:bg-[#0a0a0a]/70 backdrop-blur-2xl border-black/10 dark:border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)]'
            : 'bg-transparent border-transparent lg:bg-white/50 lg:dark:bg-black/20 lg:backdrop-blur-xl lg:border-black/5 lg:dark:border-white/5'
            }`}
        >
          <div className="w-full px-4 sm:px-6 lg:px-6">
            <div className="flex items-center justify-between h-14 lg:h-14">

              {/* Logo */}
              <a
                href="#home"
                onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}
                className="flex items-center group"
              >
                <div className="relative h-12 w-48 sm:w-60 flex items-center justify-start flex-shrink-0">
                  <img src="/images/ras.webp" alt="RAS Logo" className="relative h-10 w-auto object-contain" />
                </div>
              </a>

              {/* Desktop Navigation */}
              <div ref={navRef} className="hidden lg:flex items-center gap-1 relative">
                {/* Sliding indicator */}
                {isHomePage && (
                  <div
                    className="absolute h-[38px] bg-red-500/10 border border-red-500/30 rounded-full transition-all duration-400 ease-out pointer-events-none shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                    style={{
                      left: indicatorStyle.left,
                      width: indicatorStyle.width,
                      opacity: indicatorStyle.opacity,
                      top: '50%',
                      transform: 'translateY(-50%)',
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
                      className={`nav-link relative px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 ${isActive
                        ? 'text-red-500 dark:text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]'
                        : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                    >
                      {link.name}
                    </a>
                  );
                })}
              </div>

              {/* CTA + Auth + Mobile */}
              <div className="flex items-center gap-3">
                {/* Theme Toggle Button */}
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-black dark:text-white" />}
                </button>

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
      </div>

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
