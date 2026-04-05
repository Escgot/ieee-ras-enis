import { useEffect, useState, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Linkedin, Instagram, Facebook, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

const teamMembers = [
  {
    name: 'MAHMOUD FEKI',
    role: 'CHAIRPERSON',
    image: '/images/team-chair.jpg',
    social: {
      instagram: 'https://www.instagram.com/mahmoud.feki.5/#',
      linkedin: 'https://www.linkedin.com/in/mahmoud-feki-120a3a302/',
      facebook: 'https://www.facebook.com/mahmoud.feki.5',
      mail: 'mailto:mahmoud@example.com',
    },
  },
  {
    name: 'EDAM SELLAMI',
    role: 'VICE CHAIR',
    image: '/images/team-vice-chair.jpg',
    social: {
      instagram: 'https://www.instagram.com/edam_.s/',
      linkedin: '#',
      facebook: 'https://www.facebook.com/edam.sellami.05',
      mail: 'mailto:edam@example.com',
    },
  },
  {
    name: 'AMINA JARRAYA',
    role: 'SECRETARY',
    image: '/images/team-secretary.jpg',
    social: {
      instagram: 'http://instagram.com/aminajarraya357/',
      linkedin: 'https://www.linkedin.com/in/amina-jarraya-a1b700384/',
      facebook: 'https://www.facebook.com/amina.jarraya.963',
      mail: 'mailto:amina.jarraya@enis.tn',
    },
  },
  {
    name: 'MED AYOUB BEN AYED',
    role: 'TREASURER',
    image: '/images/team-treasurer.jpg',
    social: {
      instagram: 'https://www.instagram.com/ayoub.ben_ayed/',
      linkedin: 'https://www.linkedin.com/in/mohamed-ayoub-ben-ayed-b645bb355/',
      facebook: 'https://www.facebook.com/med.ayoub.ben.ayed.2025',
      mail: 'mailto:ayoub@example.com',
    },
  },
  {
    name: 'MOHAMED OULEDALI',
    role: 'WEB MASTER',
    image: '/images/team-web-master.jpg',
    social: {
      instagram: 'https://www.instagram.com/med_ouledali/',
      linkedin: 'https://www.linkedin.com/in/mohamed-ouledali/',
      facebook: 'https://www.facebook.com/med.ouledal1',
      mail: 'mailto:mohamed@example.com',
    },
  },
  {
    name: 'MELEK ZRIBI',
    role: 'MEDIA MANAGER',
    image: '/images/team-media-manager.jpg',
    social: {
      instagram: 'https://www.instagram.com/melek.zribi/',
      linkedin: '#',
      facebook: 'https://www.facebook.com/zribi.melek',
      mail: 'mailto:melek@example.com',
    },
  },
];

export default function Team() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
    watchDrag: true,
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [prevBtnReady, setPrevBtnReady] = useState(false);
  const [nextBtnReady, setNextBtnReady] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
    setPrevBtnReady(emblaApi.canScrollPrev());
    setNextBtnReady(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => { if (sectionRef.current) obs.unobserve(sectionRef.current); };
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    let autoPlay: ReturnType<typeof setInterval> | undefined;
    if (!isHovered && isInView) {
      autoPlay = setInterval(() => emblaApi.scrollNext(), 4000);
    }

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
      if (autoPlay) clearInterval(autoPlay);
    };
  }, [emblaApi, onSelect, isHovered, isInView]);

  return (
    <section
      id="team"
      ref={sectionRef}
      className="relative py-14 lg:py-20 overflow-hidden min-h-[80vh] flex items-center"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#090909] via-[#0b0b0b] to-[#090909]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
      <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none" />

      {/* Aurora blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(239,68,68,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* Floating geometric decorations */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full border border-red-500/8 animate-rotate-slow pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full border border-purple-500/8 animate-rotate-reverse pointer-events-none" />
      <div className="absolute top-1/2 left-4 w-16 h-16 rounded-full border border-white/4 animate-rotate-slow pointer-events-none" style={{ animationDuration: '30s' }} />

      <div className="relative w-full z-10">
        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto mb-8 w-full">
          <div className="flex flex-col items-center text-center gap-5">
            <span className="section-tag">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Build With Us
            </span>
            <h2 className="font-orbitron text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-none uppercase">
              Our <span className="text-gradient">Team</span>
            </h2>
            <p className="text-gray-500 max-w-md text-sm leading-relaxed">
              Meet the passionate minds driving innovation forward at IEEE RAS ENIS.
            </p>
          </div>
        </div>

        {/* Carousel */}
        <div className="px-0 sm:px-6 lg:px-12 max-w-[1700px] mx-auto w-full">
          <div className="relative">

            {/* Left fade edge */}
            <div
              className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 lg:w-64 z-30 pointer-events-none"
              style={{
                background: 'linear-gradient(to right, #0b0b0b 0%, rgba(11,11,11,0.85) 40%, transparent 100%)',
                backdropFilter: 'blur(2px)',
                WebkitMaskImage: 'linear-gradient(to right, black 0%, black 40%, transparent 100%)',
                maskImage: 'linear-gradient(to right, black 0%, black 40%, transparent 100%)',
              }}
            />

            {/* Right fade edge */}
            <div
              className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 lg:w-64 z-30 pointer-events-none"
              style={{
                background: 'linear-gradient(to left, #0b0b0b 0%, rgba(11,11,11,0.85) 40%, transparent 100%)',
                backdropFilter: 'blur(2px)',
                WebkitMaskImage: 'linear-gradient(to left, black 0%, black 40%, transparent 100%)',
                maskImage: 'linear-gradient(to left, black 0%, black 40%, transparent 100%)',
              }}
            />

            {/* Embla viewport */}
            <div
              className="overflow-hidden pb-16 pt-10 outline-none select-none"
              ref={emblaRef}
            >
              <div className="flex flex-row" style={{ backfaceVisibility: 'hidden' }}>
                {teamMembers.map((member, index) => {
                  const isActive = activeIndex === index;
                  // Distance from active for scale/opacity
                  const diff = Math.min(
                    Math.abs(index - activeIndex),
                    Math.abs(index - activeIndex + teamMembers.length),
                    Math.abs(index - activeIndex - teamMembers.length)
                  );

                  return (
                    <div
                      key={index}
                      className="flex-[0_0_auto] min-w-0 cursor-pointer px-3 sm:px-5"
                      onClick={() => emblaApi?.scrollTo(index)}
                    >
                      <div
                        onMouseEnter={() => { if (isActive) setIsHovered(true); }}
                        onMouseLeave={() => setIsHovered(false)}
                        className={`relative flex-shrink-0 w-[220px] sm:w-[300px] lg:w-[320px] aspect-[3/4] rounded-[2rem] overflow-hidden transition-all duration-700 group ${
                          isActive
                            ? 'scale-100 opacity-100 z-20'
                            : diff === 1
                            ? 'scale-90 opacity-40 grayscale-[50%] z-10 blur-[1px]'
                            : 'scale-80 opacity-20 grayscale blur-[2px] z-10'
                        }`}
                        style={{
                          boxShadow: isActive
                            ? '0 0 50px rgba(239,68,68,0.5), 0 0 100px rgba(239,68,68,0.2), 0 30px 60px rgba(0,0,0,0.6)'
                            : '0 10px 30px rgba(0,0,0,0.4)',
                          transform: isActive ? undefined : `scale(${diff === 1 ? 0.88 : 0.78})`,
                          outline: isActive ? '1px solid rgba(239,68,68,0.3)' : 'none',
                        }}
                      >
                        {/* Member Photo */}
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                        />

                        {/* Base gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                        {/* Active glow ring */}
                        {isActive && (
                          <div className="absolute inset-0 rounded-[2rem] pointer-events-none"
                            style={{ boxShadow: 'inset 0 0 0 1px rgba(239,68,68,0.25)' }} />
                        )}

                        {/* Holographic sheen */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-transparent to-purple-500/0 group-hover:from-red-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />

                        {/* Static Info (always visible) */}
                        <div className={`absolute inset-x-0 bottom-0 p-5 sm:p-6 transition-opacity duration-500 z-20 ${isActive ? 'group-hover:opacity-0 opacity-100' : 'opacity-100'}`}>
                          <span className="text-[9px] font-black text-red-400 tracking-[0.35em] uppercase block mb-2">
                            {member.role}
                          </span>
                          <h4 className="font-orbitron text-2xl sm:text-3xl font-black text-white leading-[0.9] uppercase drop-shadow-2xl">
                            {member.name.split(' ')[0]}&nbsp;
                            <br />
                            <span className="opacity-85 text-xl sm:text-2xl">{member.name.split(' ').slice(1).join(' ')}</span>
                          </h4>
                        </div>

                        {/* Hover Info (with socials) — active card only */}
                        {isActive && (
                          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 z-30 translate-y-2 group-hover:translate-y-0">
                            <div className="glass-dark border border-white/10 rounded-2xl p-4 sm:p-5">
                              <span className="text-[9px] font-black text-red-400 tracking-[0.35em] uppercase block mb-2">
                                {member.role}
                              </span>
                              <h4 className="font-orbitron text-xl sm:text-2xl font-black text-white mb-4 uppercase leading-tight">
                                {member.name.split(' ')[0]}{' '}
                                <span className="opacity-85">{member.name.split(' ').slice(1).join(' ')}</span>
                              </h4>
                              <div className="flex gap-3">
                                {[
                                  { href: member.social.instagram, Icon: Instagram, hover: 'hover:bg-[#E4405F] hover:border-[#E4405F]' },
                                  { href: member.social.linkedin, Icon: Linkedin, hover: 'hover:bg-[#0A66C2] hover:border-[#0A66C2]' },
                                  { href: member.social.facebook, Icon: Facebook, hover: 'hover:bg-[#1877F2] hover:border-[#1877F2]' },
                                  { href: member.social.mail, Icon: Mail, hover: 'hover:bg-[#EA4335] hover:border-[#EA4335]' },
                                ].map(({ href, Icon, hover }, i) => (
                                  <a
                                    key={i}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 border border-white/10 transition-all duration-200 text-white/60 hover:text-white ${hover}`}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Icon className="w-3.5 h-3.5" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 -mt-4">
              {/* Prev */}
              <button
                onClick={scrollPrev}
                disabled={!prevBtnReady}
                className="group w-13 h-13 flex items-center justify-center rounded-full border border-white/10 hover:border-red-500/50 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ width: 52, height: 52 }}
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {teamMembers.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => emblaApi?.scrollTo(i)}
                    className={`rounded-full transition-all duration-400 ${
                      i === activeIndex
                        ? 'w-6 h-2 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                        : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Next */}
              <button
                onClick={scrollNext}
                disabled={!nextBtnReady}
                className="group w-13 h-13 flex items-center justify-center rounded-full border border-white/10 hover:border-red-500/50 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ width: 52, height: 52 }}
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
