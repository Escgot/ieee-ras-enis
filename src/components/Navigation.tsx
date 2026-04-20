import { useState, useEffect, useRef } from 'react';
import { Menu, X, Sun, Moon, Instagram, Facebook, Linkedin } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthButton from './AuthButton';
import DiscordIcon from './DiscordIcon';

const socialLinks = [
  { icon: Instagram, href: 'https://www.instagram.com/ieee.ras.enis/', label: 'Instagram', brandColor: '#E4405F' },
  { icon: Facebook, href: 'https://www.facebook.com/IEEERASENIS', label: 'Facebook', brandColor: '#1877F2' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/ieee-ras-chapter-enis-student-branch/posts/?feedView=all', label: 'LinkedIn', brandColor: '#0A66C2' },
  { icon: DiscordIcon, href: 'https://discord.gg/HXxBRJUq', label: 'Discord', brandColor: '#5865F2' },
];

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
      <div className={`fixed top-2 sm:top-6 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 transition-all duration-700 ease-out 
        ${isScrolled ? 'translate-y-0' : 'translate-y-[-4px]'}
        ${isMobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
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
                <div className="relative h-12 w-36 sm:w-60 flex items-center justify-start flex-shrink-0">
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
                        : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5 dark:hover:bg-white/5'
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
                  className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-foreground/5 dark:hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-foreground/10 dark:hover:border-white/10"
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
          className="absolute inset-0 bg-white/40 dark:bg-[#070707]/80 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        <div
          className={`absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white/90 dark:bg-[#0a0a0a]/95 backdrop-blur-3xl 
                     transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-2xl flex flex-col
                     ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Header area */}
          <div className="p-6 flex items-center justify-between border-b border-black/5 dark:border-white/5">
            <span className="font-orbitron font-black text-lg text-gradient leading-none">RAS ENIS</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-gray-500 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1 no-scrollbar">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-4 ml-2">Menu Navigation</p>
            {navLinks.map((link, i) => {
              const sectionId = link.href.slice(1);
              const isActive = isHomePage && activeSection === sectionId;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                  className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-300
                    ${isActive
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                      : 'text-gray-700 dark:text-gray-400 hover:bg-black/[0.03] dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                    }`}
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  <span className="font-orbitron font-bold text-[12px] uppercase tracking-wider">{link.name}</span>
                  {isActive ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  ) : (
                    <div className="w-5 h-px bg-current opacity-0 group-hover:opacity-20 transition-all" />
                  )}
                </a>
              );
            })}

            <div className="pt-6 mt-6 border-t border-black/5 dark:border-white/5">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-4 ml-2">Member Access</p>
              <AuthButton mobile />
            </div>
          </div>

          {/* Footer Area */}
          <div className="p-6 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-3 justify-center">
              {socialLinks.map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-black/5 dark:bg-white/5 border border-transparent rounded-xl text-gray-500 transition-all duration-300 hover:scale-110 active:scale-95"
                  style={{ 
                    // @ts-ignore
                    '--hover-color': social.brandColor,
                  } as any}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = social.brandColor;
                    e.currentTarget.style.color = social.brandColor;
                    e.currentTarget.style.boxShadow = `0 0 15px ${social.brandColor}66`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.color = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <social.icon className="w-4 h-4 transition-colors" />
                </a>
              ))}
            </div>
            <p className="text-[8px] text-center text-gray-400 dark:text-gray-600 mt-4 font-medium uppercase tracking-widest">
              © IEEE RAS ENIS Student Branch
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
