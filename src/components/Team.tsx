import { useEffect, useState, useCallback, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useEmblaCarousel from 'embla-carousel-react';
import { Linkedin, Instagram, Facebook, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const teamMembers = [
  {
    name: 'MAHMOUD FEKI',
    role: 'CHAIRPERSON',
    image: '/images/team-chair.webp',
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
    image: '/images/team-vice-chair.webp',
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
    image: '/images/team-secretary.webp',
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
    image: '/images/team-treasurer.webp',
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
    image: '/images/team-web-master.webp',
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
    image: '/images/team-media-manager.webp',
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
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    // Parallax disabled to fix mobile performance
    return () => {};
  }, []);

  return (
    <section
      id="team"
      ref={sectionRef}
      className="relative py-14 lg:py-20 overflow-hidden min-h-[80vh] flex items-center bg-transparent"
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/10 to-transparent" />

      <div className="relative w-full z-10">
        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto mb-8 w-full">
          <div className="flex flex-col items-center text-center gap-5">
            <span className="section-tag">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Build With Us
            </span>
            <h2 className="font-orbitron text-4xl sm:text-5xl lg:text-7xl font-black text-foreground leading-none uppercase">
              Our <span className="text-gradient">Team</span>
            </h2>
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
              Meet the passionate minds driving innovation forward at IEEE RAS ENIS.
            </p>
          </div>
        </div>

        {/* Carousel / Mobile List */}
        <div className="px-4 sm:px-6 lg:px-12 max-w-[1700px] mx-auto w-full">
          <div className="relative">
            {/* Mobile View: Simple CSS Scroll */}
            <div className="flex lg:hidden overflow-x-auto gap-4 py-8 no-scrollbar snap-x">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex-[0_0_280px] snap-center"
                >
                  <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-black/40">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                      <span className="text-[9px] font-black text-red-400 tracking-[0.35em] uppercase block mb-1">
                        {member.role}
                      </span>
                      <h4 className="font-orbitron text-xl font-black text-white uppercase leading-tight">
                        {member.name}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Advanced Embla Carousel */}
            <div className="hidden lg:block relative">
              <div
                className="overflow-hidden pb-16 pt-10 outline-none select-none px-20"
                ref={emblaRef}
              >
                <div className="flex flex-row" style={{ backfaceVisibility: 'hidden' }}>
                  {teamMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex-[0_0_auto] min-w-0 px-5"
                      onClick={() => emblaApi?.scrollTo(index)}
                    >
                      <div
                        className={`relative flex-shrink-0 w-[320px] aspect-[3/4] rounded-[2rem] overflow-hidden transition-all duration-700 group will-change-transform ${activeIndex === index
                          ? 'scale-100 opacity-100 z-20 translate-y-[-8px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
                          : 'scale-90 opacity-40 z-10'
                          }`}
                      >
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        
                        {/* Static Info */}
                        <div className={`absolute inset-x-0 bottom-0 p-6 transition-opacity duration-500 z-20 ${activeIndex === index ? 'group-hover:opacity-0 opacity-100' : 'opacity-100'}`}>
                          <span className="text-[9px] font-black text-red-400 tracking-[0.35em] uppercase block mb-2">
                            {member.role}
                          </span>
                          <h4 className="font-orbitron text-2xl font-black text-white leading-tight uppercase">
                            {member.name}
                          </h4>
                        </div>

                        {/* Hover Socials */}
                        {activeIndex === index && (
                          <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 z-30 translate-y-2 group-hover:translate-y-0">
                            <div className="bg-black/80 border border-white/10 rounded-2xl p-5">
                              <span className="text-[9px] font-black text-red-400 tracking-[0.35em] uppercase block mb-2">
                                {member.role}
                              </span>
                              <h4 className="font-orbitron text-xl font-black text-white mb-4 uppercase">
                                {member.name}
                              </h4>
                              <div className="flex gap-3">
                                {[
                                  { href: member.social.instagram, Icon: Instagram, hover: 'hover:bg-[#E4405F]' },
                                  { href: member.social.linkedin, Icon: Linkedin, hover: 'hover:bg-[#0A66C2]' },
                                  { href: member.social.facebook, Icon: Facebook, hover: 'hover:bg-[#1877F2]' },
                                  { href: member.social.mail, Icon: Mail, hover: 'hover:bg-[#EA4335]' },
                                ].map(({ href, Icon, hover }, i) => (
                                  <a
                                    key={i}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 border border-white/10 transition-all duration-200 text-gray-400 hover:text-white ${hover}`}
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
                  ))}
                </div>
              </div>

              {/* Desktop Controls */}
              <div className="flex items-center justify-center gap-6 -mt-4">
                <button
                  onClick={scrollPrev}
                  disabled={!prevBtnReady}
                  className="group w-12 h-12 flex items-center justify-center rounded-full border border-white/10 hover:border-red-500/50 bg-white/5 text-gray-400 hover:text-red-400 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  {teamMembers.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => emblaApi?.scrollTo(i)}
                      className={`h-1.5 rounded-full transition-all ${i === activeIndex ? 'w-6 bg-red-500' : 'w-2 bg-white/20'}`}
                    />
                  ))}
                </div>
                <button
                  onClick={scrollNext}
                  disabled={!nextBtnReady}
                  className="group w-12 h-12 flex items-center justify-center rounded-full border border-white/10 hover:border-red-500/50 bg-white/5 text-gray-400 hover:text-red-400 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>v>
      </div>
    </section>
  );
}
