import { useState, useEffect } from 'react';
import { ArrowUp, Instagram, Facebook, Linkedin, Zap, Mail } from 'lucide-react';
import DiscordIcon from './DiscordIcon';

const footerLinks = {
  navigation: [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'News', href: '#news' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Events', href: '#events' },
    { name: 'Projects', href: '#projects' },
    { name: 'Team', href: '#team' },
    { name: 'Shop', href: '#shop' },
    { name: 'Contact', href: '#contact' },
  ],
};

const socials = [
  { icon: Instagram, href: 'https://www.instagram.com/ieee.ras.enis/', label: 'Instagram', hoverColor: 'hover:bg-[#E4405F] hover:border-[#E4405F] hover:shadow-[0_0_15px_#E4405F66]' },
  { icon: Facebook, href: 'https://www.facebook.com/IEEERASENIS', label: 'Facebook', hoverColor: 'hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-[0_0_15px_#1877F266]' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/ieee-ras-chapter-enis-student-branch/posts/?feedView=all', label: 'LinkedIn', hoverColor: 'hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:shadow-[0_0_15px_#0A66C266]' },
  { icon: DiscordIcon, href: 'https://discord.gg/HXxBRJUq', label: 'Discord', hoverColor: 'hover:bg-[#5865F2] hover:border-[#5865F2] hover:shadow-[0_0_15px_#5865F266]' },
];

const MARQUEE_WORDS = ['ROBOTICS', 'AUTOMATION', 'INNOVATION', 'ENGINEERING', 'IEEE', 'RAS ENIS', 'SFAX', 'TUNISIA'];

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#070707] border-t border-white/6 overflow-hidden">
      {/* Background aurora */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(239,68,68,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

      {/* Marquee Banner */}
      <div className="relative overflow-hidden py-4 border-b border-white/5">
        <div className="flex" style={{ width: 'max-content' }}>
          <div className="marquee-track flex items-center gap-0">
            {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, i) => (
              <div key={i} className="flex items-center">
                <span className="font-orbitron text-xs font-black text-white/8 uppercase tracking-[0.3em] px-6 whitespace-nowrap">
                  {word}
                </span>
                <span className="text-red-500/20 text-xs">◆</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-10 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

            {/* Brand Column */}
            <div className="lg:col-span-5">
              {/* Logo */}
              <a
                href="#home"
                onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}
                className="inline-flex items-center mb-0 group"
              >
                <div className="relative h-14 w-48 flex items-center justify-start">
                  <img 
                    src="/images/ras.webp" 
                    alt="RAS Logo" 
                    className="relative h-12 w-auto object-contain" 
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </a>

              <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-sm">
                IEEE Robotics & Automation Society at ENIS — empowering the next generation of engineers through innovation, collaboration, and cutting-edge technology.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-3">
                {socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`group w-10 h-10 flex items-center justify-center bg-white/[0.03] border border-white/8 rounded-xl transition-all duration-300 hover:scale-110 ${s.hoverColor}`}
                  >
                    <s.icon className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>

              {/* Quick contact */}
              <a
                href="mailto:contact@rasenis.org"
                className="mt-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-red-400 transition-colors group"
              >
                <Mail className="w-4 h-4 group-hover:text-red-400" />
                contact@rasenis.org
              </a>
            </div>

            {/* Navigation */}
            <div className="lg:col-span-3">
              <h4 className="font-orbitron font-bold text-white text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-3 h-px bg-red-500 inline-block" />
                Navigation
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.navigation.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                      className="animated-border group inline-flex items-center gap-2 text-sm text-gray-600 hover:text-white transition-colors duration-300 pb-px"
                    >
                      <span className="w-0 group-hover:w-3 h-px bg-red-500 transition-all duration-300 inline-block" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Info */}
            <div className="lg:col-span-4">
              <h4 className="font-orbitron font-bold text-white text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-3 h-px bg-red-500 inline-block" />
                Quick Info
              </h4>

              <div className="space-y-4">
                {[
                  { label: 'Founded', value: '2010' },
                  { label: 'Members', value: '200+' },
                  { label: 'Location', value: 'ENIS, Sfax, Tunisia' },
                  { label: 'Chapter', value: 'IEEE RAS Student Chapter' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-gray-600 uppercase tracking-widest">{item.label}</span>
                    <span className="text-xs text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Newsletter mini CTA */}
              <div className="mt-8 p-4 bg-white/[0.02] border border-white/6 rounded-2xl">
                <p className="text-xs text-gray-500 mb-3 font-medium">Stay updated with our latest news</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/8 rounded-xl text-xs text-white placeholder-gray-700 focus:outline-none focus:border-red-500/40 transition-colors"
                  />
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors cyber-btn">
                    <Zap className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-700">
              © {new Date().getFullYear()} IEEE RAS ENIS. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-700">
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top FAB */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 w-11 h-11 flex items-center justify-center bg-red-600 hover:bg-red-500 text-white rounded-full shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all duration-300 z-50 group ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-50 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </footer>
  );
}
