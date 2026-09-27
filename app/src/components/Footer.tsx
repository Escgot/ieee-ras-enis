import { useRef } from 'react';
import { Instagram, Facebook, Linkedin, Mail, ArrowUpRight, ChevronUp, MapPin, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import DiscordIcon from './DiscordIcon';
import { news } from '../data/news';

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
  { icon: Instagram, href: 'https://www.instagram.com/ieee.ras.enis/', label: 'Instagram', brandColor: '#E4405F' },
  { icon: Facebook, href: 'https://www.facebook.com/IEEERASENIS', label: 'Facebook', brandColor: '#1877F2' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/ieee-ras-chapter-enis-student-branch/posts/?feedView=all', label: 'LinkedIn', brandColor: '#0A66C2' },
  { icon: DiscordIcon, href: 'https://discord.gg/HXxBRJUq', label: 'Discord', brandColor: '#5865F2' },
];

/* ── Animated link with expanding underline ── */
function FooterLink({ name, href, index }: { name: string; href: string; index: number }) {
  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.li
      initial={{ opacity: 0, x: -15 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <a
        href={href}
        onClick={(e) => { e.preventDefault(); scrollToSection(href); }}
        className="group flex items-center gap-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
      >
        <span className="relative overflow-hidden">
          <span className="block group-hover:translate-y-[-100%] transition-transform duration-300">{name}</span>
          <span className="absolute top-full left-0 text-red-500 group-hover:translate-y-[-100%] transition-transform duration-300">{name}</span>
        </span>
        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0 transition-all duration-300" />
      </a>
    </motion.li>
  );
}

/* ── Social icon with brand-color glow on hover ── */
function SocialIcon({ social, index }: { social: typeof socials[0]; index: number }) {
  const iconRef = useRef<HTMLAnchorElement>(null);

  return (
    <motion.a
      ref={iconRef}
      key={index}
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.label}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.06, ease: [0.25, 0.4, 0.25, 1] }}
      whileHover={{ y: -3 }}
      className="group relative flex flex-col items-center gap-2"
    >
      <div
        className="w-11 h-11 flex items-center justify-center bg-foreground/5 dark:bg-white/[0.04] border border-foreground/10 dark:border-white/8 rounded-lg transition-all duration-400 group-hover:border-transparent group-hover:shadow-lg"
        style={{
          // @ts-ignore
          '--hover-bg': social.brandColor,
        } as React.CSSProperties}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = social.brandColor;
          e.currentTarget.style.borderColor = social.brandColor;
          e.currentTarget.style.boxShadow = `0 4px 20px ${social.brandColor}44`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '';
          e.currentTarget.style.borderColor = '';
          e.currentTarget.style.boxShadow = '';
        }}
      >
        <social.icon className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors duration-300" />
      </div>
      <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {social.label}
      </span>
    </motion.a>
  );
}

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer ref={footerRef} className="relative bg-background overflow-hidden">
      {/* ── Top accent line ── */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.25, 0.4, 0.25, 1] }}
        className="h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent origin-center"
      />

      {/* ── Background elements ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(239,68,68,0.05) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.04) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute inset-0 cyber-grid opacity-[0.015]" />
      </div>

      {/* ── News Marquee ── */}
      <div className="relative overflow-hidden py-3 border-b border-foreground/5 dark:border-white/5">
        <div className="flex" style={{ width: 'max-content' }}>
          <div className="marquee-track flex items-center gap-0">
            {[...news, ...news].map((item, i) => (
              <div key={i} className="flex items-center">
                <span className="flex items-center gap-3 font-display text-[10px] font-black text-foreground/70 uppercase tracking-[0.2em] px-8 whitespace-nowrap group cursor-pointer hover:text-red-500 transition-colors">
                  {item.title}
                </span>
                <span className="text-red-500/40 text-[8px]">◆</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-14 lg:pt-16 pb-10 lg:pb-12">
        <div className="max-w-7xl mx-auto">

          {/* ── CTA Section — scroll to top ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-14 lg:mb-16"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="h-px w-8 bg-gradient-to-r from-red-500 to-transparent" />
                <span className="font-orbitron text-[10px] font-bold uppercase tracking-[0.4em] text-red-500 flex items-center gap-1.5">
                  <Zap className="w-3 h-3" />
                  Stay Connected
                </span>
              </motion.div>
              <h2 className="font-orbitron text-3xl sm:text-4xl lg:text-5xl font-black text-foreground leading-[0.95] uppercase tracking-tight">
                Let's Build
                <br />
                <span className="text-gradient">The Future</span>
              </h2>
            </div>

            {/* Back to top button */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -3 }}
              className="group flex items-center gap-3 px-5 py-3 bg-foreground/5 dark:bg-white/[0.04] border border-foreground/10 dark:border-white/8 rounded-lg hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-300"
            >
              <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
              <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground uppercase tracking-[0.15em] transition-colors">Back to Top</span>
            </motion.button>
          </motion.div>

          {/* ── Grid ── */}
          <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

            {/* Brand Column */}
            <div className="lg:col-span-5">
              <motion.a
                href="#home"
                onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}
                className="inline-flex items-center mb-5 group"
                aria-label="Home"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <div className="relative h-14 w-48 flex items-center justify-start">
                  <img 
                    src="/images/ras.webp" 
                    alt="RAS Logo" 
                    width="200"
                    height="48"
                    className="relative h-12 w-auto object-contain" 
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </motion.a>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                className="text-muted-foreground text-sm leading-relaxed mb-7 max-w-sm"
              >
                IEEE Robotics & Automation Society at ENIS — empowering the next generation of engineers through innovation, collaboration, and cutting-edge technology.
              </motion.p>

              {/* Social icons with brand colors */}
              <div className="flex items-start gap-4 mb-7">
                {socials.map((s, i) => (
                  <SocialIcon key={i} social={s} index={i} />
                ))}
              </div>

              {/* Contact info */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                className="space-y-2"
              >
                <a
                  href="mailto:sbc.enis.ras@ieee.org"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-red-500 transition-colors group"
                >
                  <Mail className="w-3.5 h-3.5 text-red-500/60 group-hover:text-red-500 transition-colors" />
                  <span>sbc.enis.ras@ieee.org</span>
                </a>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-red-500/60" />
                  <span>ENIS, Sfax, Tunisia</span>
                </div>
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="lg:col-span-4 lg:pl-8">
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
                className="font-orbitron font-bold text-foreground text-xs uppercase tracking-[0.25em] mb-5 flex items-center gap-2"
              >
                <span className="w-4 h-px bg-red-500 inline-block flex-shrink-0" />
                Navigation
              </motion.h2>
              <ul className="space-y-0">
                {footerLinks.navigation.map((link, i) => (
                  <FooterLink key={i} name={link.name} href={link.href} index={i} />
                ))}
              </ul>
            </div>

            {/* Newsletter / Connect */}
            <div className="lg:col-span-3">
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
                className="font-orbitron font-bold text-foreground text-xs uppercase tracking-[0.25em] mb-5 flex items-center gap-2"
              >
                <span className="w-4 h-px bg-red-500 inline-block flex-shrink-0" />
                Join Us
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                className="text-muted-foreground text-sm leading-relaxed mb-5"
              >
                Ready to innovate? Join the IEEE RAS ENIS chapter and be part of the robotics revolution.
              </motion.p>

              <motion.a
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }}
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-red-600 transition-all duration-300 shadow-[0_4px_16px_rgba(239,68,68,0.25)] hover:shadow-[0_6px_24px_rgba(239,68,68,0.35)]"
              >
                Get in Touch
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </motion.a>

              {/* Quick stats */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                className="mt-8 grid grid-cols-2 gap-3"
              >
                {[
                  { value: '4+', label: 'Projects' },
                  { value: '50+', label: 'Members' },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 bg-foreground/[0.02] dark:bg-white/[0.02] border border-foreground/5 dark:border-white/5 rounded-lg">
                    <div className="font-numeric text-xl font-black text-foreground leading-none mb-1 tracking-tight">{stat.value}</div>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="relative border-t border-foreground/5 dark:border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[11px] text-muted-foreground font-medium"
            >
              © {new Date().getFullYear()} IEEE RAS ENIS. All rights reserved.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium"
            >
              Crafted by{' '}
              <a
                href="https://github.com/Escgot/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-400 transition-colors font-bold"
              >
                Escgot
              </a>
              <span className="text-muted-foreground/30 mx-1">·</span>
              IEEE RAS ENIS
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
