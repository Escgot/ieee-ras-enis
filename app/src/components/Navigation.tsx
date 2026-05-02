import { useState, useEffect, useRef } from 'react';
import { Menu, X, Sun, Moon, Instagram, Facebook, Linkedin, Home, Newspaper, Image as ImageIcon, Calendar, ShoppingBag, Users, Mail, Cpu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import DiscordIcon from './DiscordIcon';

const socialLinks = [
  { icon: Instagram, href: 'https://www.instagram.com/ieee.ras.enis/', label: 'Instagram', brandColor: '#E4405F' },
  { icon: Facebook, href: 'https://www.facebook.com/IEEERASENIS', label: 'Facebook', brandColor: '#1877F2' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/ieee-ras-chapter-enis-student-branch/posts/?feedView=all', label: 'LinkedIn', brandColor: '#0A66C2' },
  { icon: DiscordIcon, href: 'https://discord.gg/HXxBRJUq', label: 'Discord', brandColor: '#5865F2' },
];

const navLinks = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'About', href: '#about', icon: Users },
  { name: 'News', href: '#news', icon: Newspaper },
  { name: 'Gallery', href: '#gallery', icon: ImageIcon },
  { name: 'Events', href: '#events', icon: Calendar },
  { name: 'Projects', href: '#projects', icon: Cpu },
  { name: 'Team', href: '#team', icon: Users },
  { name: 'Shop', href: '#shop', icon: ShoppingBag },
  { name: 'Contact', href: '#contact', icon: Mail },
];

const bottomNavLinks = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'News', href: '#news', icon: Newspaper },
  { name: 'Events', href: '#events', icon: Calendar },
  { name: 'Shop', href: '#shop', icon: ShoppingBag },
  { name: 'Menu', href: 'menu', icon: Menu }, // Special case for opening menu
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
      {/* Top Navbar (Desktop & Mobile Header) */}
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

              {/* Desktop Links */}
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

              {/* Actions */}
              <div className="flex items-center gap-3">
                {/* Theme Toggle Button */}
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-foreground/5 dark:hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-foreground/10 dark:hover:border-white/10"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-black dark:text-white" />}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Bottom Navigation (Mobile Only) */}
      <div className="lg:hidden fixed bottom-2 left-4 right-4 z-50 pointer-events-none">
        <nav className="pointer-events-auto bg-white/80 dark:bg-black/70 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="flex items-center justify-around h-16 px-2">
            {bottomNavLinks.map((link) => {
              const sectionId = link.href.slice(1);
              const isActive = link.name === 'Menu' ? isMobileMenuOpen : (isHomePage && activeSection === sectionId);

              return (
                <button
                  key={link.name}
                  onClick={() => link.name === 'Menu' ? setIsMobileMenuOpen(!isMobileMenuOpen) : scrollToSection(link.href)}
                  className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 relative group
                    ${isActive ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'}
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-active"
                      className="absolute inset-x-2 top-1 bottom-1 bg-red-500/10 rounded-2xl -z-10"
                    />
                  )}
                  <link.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-active:scale-90'}`} />
                  <span className="text-[10px] font-black uppercase tracking-[0.05em]">{link.name}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Mobile/Side Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[60] lg:z-40">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-3xl shadow-2xl flex flex-col border-l border-white/10"
            >
              <div className="p-6 flex items-center justify-between border-b border-black/5 dark:border-white/5">
                <div className="flex flex-col">
                  <span className="font-orbitron font-black text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-600">RAS ENIS</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">Student Branch</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 text-muted-foreground hover:text-red-500 transition-all active:scale-90"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1 no-scrollbar">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mb-4 ml-2">Navigation</p>
                {navLinks.map((link, i) => {
                  const sectionId = link.href.slice(1);
                  const isActive = isHomePage && activeSection === sectionId;
                  return (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                      className={`group flex items-center justify-between p-3 rounded-2xl transition-all duration-300
                        ${isActive
                          ? 'bg-red-500 text-white shadow-[0_10px_30px_rgba(239,68,68,0.3)]'
                          : 'text-muted-foreground hover:bg-black/[0.03] dark:hover:bg-white/5 hover:text-foreground'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <link.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground/60'}`} />
                        <span className="font-orbitron font-bold text-[13px] uppercase tracking-wider">{link.name}</span>
                      </div>
                      <X className={`w-4 h-4 opacity-0 transition-all ${isActive ? 'rotate-45' : 'group-hover:opacity-20'}`} />
                    </motion.a>
                  );
                })}

                <div className="pt-6 mt-6 border-t border-black/5 dark:border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mb-4 ml-2">Join Our Community</p>
                  <div className="grid grid-cols-2 gap-3">
                    {socialLinks.map((social, idx) => (
                      <a
                        key={idx}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-black/5 dark:bg-white/5 border border-transparent rounded-2xl text-muted-foreground hover:text-foreground transition-all duration-300 group"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = `${social.brandColor}33`;
                          e.currentTarget.style.backgroundColor = `${social.brandColor}11`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'transparent';
                          e.currentTarget.style.backgroundColor = '';
                        }}
                      >
                        <social.icon className="w-5 h-5 transition-transform group-hover:scale-110" style={{ color: social.brandColor }} />
                        <span className="text-[11px] font-bold uppercase tracking-tight">{social.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                <p className="text-[9px] text-center text-muted-foreground font-bold uppercase tracking-[0.3em]">
                  © 2026 IEEE RAS ENIS
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
