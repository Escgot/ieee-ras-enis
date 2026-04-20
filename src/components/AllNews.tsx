import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, Calendar, MapPin, Clock, X, ChevronLeft, ChevronRight, Share2, Target, Zap } from 'lucide-react';
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

      // Alternating timeline nodes entrance
      gsap.utils.toArray<HTMLElement>('.timeline-node').forEach((node, index) => {
        const isLeft = index % 2 === 0;
        gsap.fromTo(node,
          { opacity: 0, x: isLeft ? -80 : 80, scale: 0.9 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: node,
              start: 'top 85%',
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#070707] pt-24 pb-20 relative overflow-hidden">
      {/* Rich Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-600/8 blur-[180px] rounded-full" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-purple-600/8 blur-[160px] rounded-full" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-fuchsia-600/6 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-red-500/5 blur-[200px] rounded-full" />
        <div className="absolute inset-0 cyber-grid opacity-[0.03] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070707] via-transparent to-[#070707] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Navigation & Header */}
        <div className="header-animate mb-16 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center lg:items-start">
            <button
              onClick={onBack}
              className="group flex items-center gap-2 px-5 py-2.5 mb-6 text-sm font-bold text-gray-400 bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-xl transition-all duration-300 uppercase tracking-widest backdrop-blur-md"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Return to Grid
            </button>
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-red-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Global Intel</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-orbitron font-black text-white uppercase italic tracking-tighter">
              Archive <span className="text-gradient">Logs</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl glass-dark">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">System Status</p>
              <p className="text-sm font-bold text-white tracking-widest uppercase"><span className="text-green-500">Online</span> / {news.length} Entries</p>
            </div>
          </div>
        </div>

        {/* Paired 2-Column Grid Architecture */}
        <div ref={timelineRef} className="relative mt-10">

          <div className="space-y-6">
            {Array.from({ length: Math.ceil(news.length / 2) }, (_, pairIdx) => {
              const left = news[pairIdx * 2];
              const right = news[pairIdx * 2 + 1];
              return (
                <div key={pairIdx} className="timeline-node relative">
                  {/* Central Timeline Dot (Desktop) */}
                  <div className="absolute left-1/2 top-8 w-4 h-4 rounded-full bg-[#070707] border-2 border-red-500 -translate-x-1/2 z-20 hidden lg:block shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                    <div className="absolute inset-0.5 bg-red-500 rounded-full animate-pulse" />
                  </div>
                  {/* Central Line Segment (Desktop) */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500/40 via-purple-500/30 to-red-500/40 -translate-x-1/2 hidden lg:block" />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                    {/* Left Post */}
                    {left && (
                      <div className="group cursor-pointer" onClick={() => setSelectedNews(left)}>
                        <div className="relative overflow-hidden bg-white/[0.02] border border-white/10 rounded-2xl p-5 lg:p-6 hover:border-red-500/30 transition-all duration-500 backdrop-blur-md hover:bg-white/[0.04] h-full">
                          <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-transparent to-purple-500/0 group-hover:from-red-500/10 group-hover:to-purple-500/5 transition-opacity duration-700 pointer-events-none opacity-0 group-hover:opacity-100" />
                          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 group-hover:via-red-500/50 to-transparent transition-colors duration-500" />

                          <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
                              LOG #{String(left.id).padStart(3, '0')}
                            </span>
                            <div className="flex items-center gap-2 opacity-50">
                              <Calendar className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">{left.date}</span>
                            </div>
                          </div>

                          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 border border-white/5">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                            <img src={left.image} alt={left.title} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                          </div>

                          <h3 className="text-lg font-orbitron font-black text-white uppercase italic leading-tight mb-3 group-hover:text-red-400 transition-colors line-clamp-2">
                            {left.title}
                          </h3>
                          <p className="text-xs text-gray-400 leading-relaxed font-medium line-clamp-2 mb-4">{left.excerpt}</p>

                          <div className="flex items-center justify-between pt-3 border-t border-white/5">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                <MapPin className="w-3 h-3 text-purple-500" />{left.location}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-white hover:text-red-500 uppercase tracking-[0.15em] transition-colors">
                              Read <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Right Post */}
                    {right && (
                      <div className="group cursor-pointer" onClick={() => setSelectedNews(right)}>
                        <div className="relative overflow-hidden bg-white/[0.02] border border-white/10 rounded-2xl p-5 lg:p-6 hover:border-red-500/30 transition-all duration-500 backdrop-blur-md hover:bg-white/[0.04] h-full">
                          <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-transparent to-purple-500/0 group-hover:from-red-500/10 group-hover:to-purple-500/5 transition-opacity duration-700 pointer-events-none opacity-0 group-hover:opacity-100" />
                          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 group-hover:via-red-500/50 to-transparent transition-colors duration-500" />

                          <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
                              LOG #{String(right.id).padStart(3, '0')}
                            </span>
                            <div className="flex items-center gap-2 opacity-50">
                              <Calendar className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">{right.date}</span>
                            </div>
                          </div>

                          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 border border-white/5">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                            <img src={right.image} alt={right.title} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                          </div>

                          <h3 className="text-lg font-orbitron font-black text-white uppercase italic leading-tight mb-3 group-hover:text-red-400 transition-colors line-clamp-2">
                            {right.title}
                          </h3>
                          <p className="text-xs text-gray-400 leading-relaxed font-medium line-clamp-2 mb-4">{right.excerpt}</p>

                          <div className="flex items-center justify-between pt-3 border-t border-white/5">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                <MapPin className="w-3 h-3 text-purple-500" />{right.location}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-white hover:text-red-500 uppercase tracking-[0.15em] transition-colors">
                              Read <ChevronRight className="w-3.5 h-3.5" />
                            </div>
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
      </div>

      {/* High-Fidelity Modal View (Mirrored from Featured News/Projects) */}
      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent className="sm:max-w-6xl w-[95vw] lg:w-[90vw] lg:aspect-[2/1] bg-[#0c0515]/95 border-purple-500/20 backdrop-blur-3xl p-0 overflow-hidden rounded-3xl outline-none shadow-[0_0_80px_rgba(139,92,246,0.15)] flex flex-col my-4">
          {selectedNews && (
            <div className="relative w-full h-full max-h-[95vh] lg:max-h-none overflow-hidden no-scrollbar flex flex-col lg:flex-row">
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-white bg-black/20 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side: Hero Image - Swippable Gallery */}
              <div className="w-full lg:w-[60%] h-[350px] sm:h-[450px] lg:h-full relative shrink-0 overflow-hidden bg-[#050505] flex items-center justify-center group/hero">
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
              <div className="lg:w-[40%] px-6 pt-6 pb-2 sm:px-10 sm:pt-10 sm:pb-4 lg:px-12 lg:pt-12 lg:pb-4 relative z-10 flex flex-col -mt-20 sm:-mt-28 lg:mt-0 flex-grow bg-gradient-to-t from-[#0c0515] via-[#0c0515] to-transparent lg:bg-none min-h-0 overflow-hidden">

                {/* Title */}
                <DialogTitle className="hidden">{selectedNews.title}</DialogTitle>
                <h2 className="font-orbitron text-base sm:text-lg lg:text-xl font-black text-white mb-4 lg:mb-6 leading-tight tracking-wide shrink-0">
                  {selectedNews.title}
                </h2>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4 lg:mb-6 text-xs text-gray-300 font-medium shrink-0">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-fuchsia-500" />
                    <span>{selectedNews.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-fuchsia-500" />
                    <span>{selectedNews.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-fuchsia-500" />
                    <span>{selectedNews.readTime}</span>
                  </div>
                </div>

                {/* Top Divider */}
                <div className="h-px w-full bg-white/5 mb-4 lg:mb-6 shrink-0" />

                {/* Content / Excerpt */}
                <div className="space-y-4 text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 lg:mb-6 font-medium flex-grow overflow-y-auto min-h-0 pr-4 custom-scrollbar">
                  <p className="text-gray-200">
                    {selectedNews.excerpt}
                  </p>
                  <p>
                    This is the extended tactical brief. Dive deep into the archives to reveal the strategic decisions, technical challenges, and ultimate triumphs behind this mission.
                  </p>
                  <p>
                    Connecting members and celebrating achievements is a core directive of RAS ENIS. Our continuous evolution pushes the boundaries of autonomous systems.
                  </p>

                  <button className="flex items-center gap-2 mt-6 px-4 py-2 bg-white/[0.05] hover:bg-fuchsia-500 text-white rounded-lg transition-colors border border-white/10 text-[10px] font-black uppercase tracking-widest w-fit">
                    <Share2 className="w-3.5 h-3.5" /> Share Intel
                  </button>
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
