import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, Calendar, MapPin, Clock, X, ChevronLeft, ChevronRight, Target } from 'lucide-react';
import { news, type NewsItem } from '../data/news';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';

gsap.registerPlugin(ScrollTrigger);

export default function AllNews({ onBack }: { onBack: () => void }) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const newsGalleryRef = useRef<HTMLDivElement>(null);

  // Smooth scroll for thumbnails
  const scrollGallery = (direction: 'left' | 'right') => {
    if (newsGalleryRef.current) {
      const scrollAmount = 200;
      newsGalleryRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (selectedNews) {
      setActiveImage(selectedNews.image);
    }
  }, [selectedNews]);

  // Cinematic GSAP Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main header reveal
      gsap.fromTo('.header-animate',
        { opacity: 0, y: -40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }
      );

      // Central timeline glow line grow
      gsap.fromTo('.timeline-line',
        { height: 0, opacity: 0 },
        { height: '100%', opacity: 1, duration: 1.5, ease: 'power2.inOut', delay: 0.5 }
      );

      // One-by-one staggered entrance using batching
      ScrollTrigger.batch('.timeline-node', {
        start: 'top 90%',
        onEnter: (batch) => {
          // Sort items that enter simultaneously by their true chronological index
          const sorted = [...batch].sort((a, b) => {
            const elA = a as HTMLElement;
            const elB = b as HTMLElement;
            return parseInt(elA.dataset.index || '0') - parseInt(elB.dataset.index || '0');
          });

          // Animate cards one by one
          gsap.fromTo(sorted,
            { opacity: 0, x: -40, scale: 0.95 },
            { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: 'power2.out', stagger: 0.2 }
          );

          // Animate dots exactly after their corresponding card
          sorted.forEach((node, i) => {
            const dot = node.querySelector('.timeline-dot');
            if (dot) {
              gsap.fromTo(dot,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.5)', delay: (i * 0.2) + 0.2 }
              );
            }
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-background pt-0 pb-20 relative transition-colors duration-500">
      {/* Rich Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-600/5 dark:bg-red-600/8 blur-[180px] rounded-full" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-purple-600/5 dark:bg-purple-600/8 blur-[160px] rounded-full" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-fuchsia-600/5 dark:bg-fuchsia-600/6 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-red-500/5 blur-[200px] rounded-full" />
        <div className="absolute inset-0 cyber-grid opacity-[0.05] dark:opacity-[0.03] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none opacity-50" />
      </div>

      {/* Sticky Header */}
      <div className="relative border-b border-black/5 dark:border-white/5 bg-transparent sticky top-0 z-40 backdrop-blur-2xl pt-4">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="p-3 bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 rounded-full hover:bg-red-500 hover:text-white transition-all group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              <div>
                <h1 className="font-orbitron text-2xl font-bold text-foreground uppercase tracking-tight">Archive <span className="text-red-500">Logs</span></h1>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Total {news.length} Historical Entries</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 mt-8">

        {/* Central Asymmetrical Timeline Architecture */}
        <div ref={timelineRef} className="relative mt-6">
          {/* Main Central Glow Line */}
          <div className="timeline-line absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-600 via-purple-600 to-transparent lg:-translate-x-1/2 rounded-full hidden sm:block shadow-[0_0_15px_rgba(220,38,38,0.5)]" />

          {/* Masonry 2-Column F1 Grid Architecture */}
          <div className="relative flex flex-col lg:flex-row items-start gap-8 lg:gap-16">

            {/* Central Timeline Glow Line (Desktop) */}
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-600 via-purple-600 to-transparent lg:-translate-x-1/2 rounded-full hidden sm:block shadow-[0_0_15px_rgba(220,38,38,0.5)]" />

            {/* Left Column (Posts 1, 3, 5...) */}
            <div className="w-full lg:w-1/2 flex flex-col gap-8">
              {news.filter((_, idx) => idx % 2 === 0).map((item, mapIdx) => (
                <div key={item.id} data-index={mapIdx * 2} className="timeline-node relative group cursor-pointer" onClick={() => setSelectedNews(item)}>
                  {/* Core Dot */}
                  <div className="timeline-dot absolute -right-6 top-[calc(50%-8px)] w-4 h-4 rounded-full bg-white dark:bg-[#070707] border-2 border-red-500 z-20 hidden lg:block shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                    <div className="absolute inset-0.5 bg-red-500 rounded-full animate-pulse" />
                  </div>

                  <div className="relative overflow-hidden bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-[2rem] p-6 lg:p-8 hover:border-red-500/30 transition-all duration-500 backdrop-blur-md hover:bg-black/[0.04] dark:hover:bg-white/[0.04]">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-transparent to-purple-500/0 group-hover:from-red-500/10 group-hover:to-purple-500/5 transition-opacity duration-700 pointer-events-none opacity-0 group-hover:opacity-100" />
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/20 group-hover:via-red-500/50 to-transparent transition-colors duration-500" />

                    <div className="flex items-center gap-3 mb-6 justify-start lg:justify-end">
                      <div className="flex items-center gap-2 opacity-50">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{item.date}</span>
                      </div>
                    </div>

                    <div className="relative w-full aspect-[21/9] sm:h-48 rounded-xl overflow-hidden mb-6 border border-white/5">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 scale-110 group-hover:scale-100">
                        <Target className="w-12 h-12 text-red-500/50 mix-blend-overlay animate-spin-slow" />
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-orbitron font-black text-foreground uppercase italic leading-tight mb-4 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors lg:text-right">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium line-clamp-3 mb-6 group-hover:text-foreground transition-colors lg:text-right whitespace-pre-line">
                      {item.excerpt}
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-black/5 dark:border-white/5 lg:flex-row-reverse">
                      <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest"><MapPin className="w-3.5 h-3.5 text-purple-500" />{item.location}</div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest"><Clock className="w-3.5 h-3.5 text-purple-500" />{item.readTime}</div>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-[0.2em] group-hover:gap-3 transition-all whitespace-nowrap">
                        Read Entry
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column (Posts 2, 4, 6...) - Offset downwards for overlap */}
            <div className="w-full lg:w-1/2 flex flex-col gap-8 lg:mt-32">
              {news.filter((_, idx) => idx % 2 !== 0).map((item, mapIdx) => (
                <div key={item.id} data-index={mapIdx * 2 + 1} className="timeline-node relative group cursor-pointer" onClick={() => setSelectedNews(item)}>
                  {/* Core Dot (Left side of card) */}
                  <div className="timeline-dot absolute -left-6 top-[calc(50%-8px)] w-4 h-4 rounded-full bg-white dark:bg-[#070707] border-2 border-red-500 z-20 hidden lg:block shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                    <div className="absolute inset-0.5 bg-red-500 rounded-full animate-pulse" />
                  </div>

                  <div className="relative overflow-hidden bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-[2rem] p-6 lg:p-8 hover:border-red-500/30 transition-all duration-500 backdrop-blur-md hover:bg-black/[0.04] dark:hover:bg-white/[0.04]">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-transparent to-purple-500/0 group-hover:from-red-500/10 group-hover:to-purple-500/5 transition-opacity duration-700 pointer-events-none opacity-0 group-hover:opacity-100" />
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/20 group-hover:via-red-500/50 to-transparent transition-colors duration-500" />

                    <div className="flex items-center gap-3 mb-6 justify-start">
                      <div className="flex items-center gap-2 opacity-50">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{item.date}</span>
                      </div>
                    </div>

                    <div className="relative w-full aspect-[21/9] sm:h-48 rounded-xl overflow-hidden mb-6 border border-white/5">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 scale-110 group-hover:scale-100">
                        <Target className="w-12 h-12 text-red-500/50 mix-blend-overlay animate-spin-slow" />
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-orbitron font-black text-foreground uppercase italic leading-tight mb-4 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium line-clamp-3 mb-6 group-hover:text-foreground transition-colors">
                      {item.excerpt}
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-black/5 dark:border-white/5">
                      <div className="flex flex-wrap items-center gap-4 justify-start">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest"><MapPin className="w-3.5 h-3.5 text-purple-500" />{item.location}</div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest"><Clock className="w-3.5 h-3.5 text-purple-500" />{item.readTime}</div>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-[0.2em] group-hover:gap-3 transition-all whitespace-nowrap">
                        Read Entry
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* High-Fidelity Modal View (Mirrored from Featured News/Projects) */}
      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent className="sm:max-w-6xl w-[95vw] lg:w-[90vw] lg:aspect-[2/1] bg-white/95 dark:bg-[#0c0515]/95 border-black/10 dark:border-purple-500/20 backdrop-blur-3xl p-0 overflow-hidden rounded-3xl outline-none shadow-[0_0_80px_rgba(0,0,0,0.1)] dark:shadow-[0_0_80px_rgba(139,92,246,0.15)] flex flex-col my-4">
          {selectedNews && (
            <div className="relative w-full h-full max-h-[95vh] lg:max-h-none overflow-hidden no-scrollbar flex flex-col lg:flex-row">
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 z-50 p-2 text-foreground active:scale-95 hover:text-red-500 bg-black/5 dark:bg-black/20 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl transition-all duration-300 backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side: Hero Image - Swippable Gallery */}
              <div className="w-full lg:w-[60%] h-[350px] sm:h-[450px] lg:h-full relative shrink-0 overflow-hidden bg-gray-100 dark:bg-[#050505] flex items-center justify-center group/hero">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage || selectedNews.image}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      const swipe = info.offset.x;
                      const photos = selectedNews.photos || [selectedNews.image];
                      const currentIdx = photos.indexOf(activeImage || selectedNews.image);

                      if (swipe < -50) { // Swipe Left -> Next
                        const nextIdx = (currentIdx + 1) % photos.length;
                        setActiveImage(photos[nextIdx]);
                      } else if (swipe > 50) { // Swipe Right -> Prev
                        const prevIdx = (currentIdx - 1 + photos.length) % photos.length;
                        setActiveImage(photos[prevIdx]);
                      }
                    }}
                    className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing bg-black/20"
                  >
                    <img
                      src={activeImage || selectedNews.image}
                      alt={selectedNews.title}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Visual Metadata Overlay */}
                <div className="absolute top-6 left-6 z-20 flex flex-col gap-2 translate-y-2 group-hover/hero:translate-y-0 transition-transform duration-500">
                  <span className="px-3 py-1.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                    {selectedNews.category}
                  </span>
                </div>

                {/* Navigation Overlay Hints */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/40 to-transparent pointer-events-none opacity-0 group-hover/hero:opacity-100 transition-opacity flex items-center justify-center">
                  <ChevronLeft className="w-6 h-6 text-white/20" />
                </div>
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/40 to-transparent pointer-events-none opacity-0 group-hover/hero:opacity-100 transition-opacity flex items-center justify-center">
                  <ChevronRight className="w-6 h-6 text-white/20" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0515] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#0c0515] lg:via-transparent lg:to-transparent pointer-events-none" />
              </div>

              {/* Right Side: Main Content Area */}
              <div className="lg:w-[40%] px-6 pt-6 pb-2 sm:px-10 sm:pt-10 sm:pb-4 lg:px-12 lg:pt-12 lg:pb-4 relative z-10 flex flex-col -mt-20 sm:-mt-28 lg:mt-0 flex-grow bg-gradient-to-t from-white via-white dark:from-[#0c0515] dark:via-[#0c0515] to-transparent lg:bg-none min-h-0 overflow-hidden">

                {/* Title */}
                <DialogTitle className="hidden">{selectedNews.title}</DialogTitle>
                <h2 className="font-orbitron text-base sm:text-lg lg:text-xl font-black text-foreground mb-4 lg:mb-6 leading-tight tracking-wide shrink-0">
                  {selectedNews.title}
                </h2>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4 lg:mb-6 text-xs text-muted-foreground font-medium shrink-0">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{selectedNews.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{selectedNews.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{selectedNews.readTime}</span>
                  </div>
                </div>

                {/* Top Divider */}
                <div className="h-px w-full bg-black/5 dark:bg-white/5 mb-4 lg:mb-6 shrink-0" />

                {/* Content / Excerpt */}
                <div className="space-y-4 text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4 lg:mb-6 font-medium flex-grow overflow-y-auto min-h-0 pr-4 custom-scrollbar">
                  <p className="text-foreground font-semibold whitespace-pre-line">
                    {selectedNews.excerpt}
                  </p>
                  <p>
                    This is the extended tactical brief. Dive deep into the archives to reveal the strategic decisions, technical challenges, and ultimate triumphs behind this mission.
                  </p>
                  <p>
                    Connecting members and celebrating achievements is a core directive of RAS ENIS. Our continuous evolution pushes the boundaries of autonomous systems.
                  </p>


                </div>

                {/* Bottom Divider */}
                <div className="h-px w-full bg-white/5 mb-3 shrink-0" />

                {/* Bottom Photos Gallery */}
                <div className="shrink-0 relative">
                  {selectedNews.photos && selectedNews.photos.length > 0 ? (
                    <div className="relative group/gallery">
                      <button
                        onClick={() => scrollGallery('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-black/70 hover:bg-fuchsia-500 text-white rounded-full opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 border border-white/20 -ml-3 backdrop-blur-md"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>

                      <div
                        ref={newsGalleryRef}
                        className="flex flex-row overflow-x-auto gap-2 no-scrollbar snap-x scroll-smooth"
                      >
                        {selectedNews.photos.map((photo, idx) => (
                          <div
                            key={idx}
                            onClick={() => setActiveImage(photo)}
                            className="w-16 h-12 sm:w-20 sm:h-14 lg:w-24 lg:h-16 shrink-0 rounded-lg overflow-hidden border border-white/10 group cursor-pointer snap-center relative"
                          >
                            <img
                              src={photo}
                              alt={`Gallery ${idx + 1}`}
                              className={`w-full h-full object-cover transition-all duration-500 hover:scale-110 ${activeImage === photo ? 'opacity-100 scale-110' : 'opacity-40 group-hover:opacity-100'}`}
                            />
                            {activeImage === photo && (
                              <div className="absolute inset-0 border-2 border-fuchsia-500 rounded-lg pointer-events-none shadow-[inset_0_0_10px_rgba(217,70,239,0.5)]"></div>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => scrollGallery('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-black/70 hover:bg-fuchsia-500 text-white rounded-full opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 border border-white/20 -mr-3 backdrop-blur-md"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="hidden"></div>
                  )}
                </div>

              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
