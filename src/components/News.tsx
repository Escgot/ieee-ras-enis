import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Clock, Calendar, TrendingUp, X, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { news, type NewsItem } from '../data/news';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';

gsap.registerPlugin(ScrollTrigger);

export default function News({ onViewAll }: { onViewAll?: () => void }) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const newsGalleryRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.news-featured',
        { opacity: 0, x: -50, scale: 0.97 },
        {
          opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
        }
      );
      gsap.fromTo('.news-item',
        { opacity: 0, x: 30 },
        {
          opacity: 1, x: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
        }
      );

      // Section parallax
      gsap.to(sectionRef.current, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const featured = news.find((n) => n.isFeatured) || news[0];
  const others = news.filter((n) => !n.isFeatured).slice(0, 4);

  return (
    <section id="news" ref={sectionRef} className="relative py-14 lg:py-20 overflow-hidden bg-transparent">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-gradient-to-r from-red-500 to-transparent" />
              <span className="font-orbitron text-xs font-bold uppercase tracking-[0.35em] text-red-500">Latest</span>
            </div>
            <h2 className="font-orbitron text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-tight uppercase">
              News &{' '}<span className="text-gradient">Updates</span>
            </h2>
          </div>
          <button className="group cyber-btn flex items-center gap-2 px-7 py-3.5 border border-white/10 hover:border-red-500/40 hover:text-red-400 transition-all rounded-xl font-bold text-[11px] tracking-widest text-gray-400 uppercase hover:bg-red-500/5">
            All Posts
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* News Grid */}
        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* Featured Post */}
          <div 
            className="news-featured lg:col-span-7 group cursor-pointer"
            onClick={() => setSelectedNews(featured)}
          >
            <div className="relative h-full flex flex-col bg-white/[0.02] border border-white/6 rounded-3xl overflow-hidden hover:border-red-500/25 transition-all duration-500 holographic hover:shadow-[0_20px_60px_rgba(239,68,68,0.06)]">
              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-black/30 to-transparent z-10" />
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-80"
                  loading="lazy"
                  decoding="async"
                />
                {/* Category */}
                <div className="absolute top-5 left-5 z-20">
                  <span className="px-4 py-1.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                    {featured.category}
                  </span>
                </div>
                <div className="absolute top-5 right-5 z-20 flex items-center gap-1.5 px-3 py-1.5 glass-dark rounded-lg">
                  <TrendingUp className="w-3 h-3 text-red-400" />
                  <span className="text-[10px] text-gray-300 font-medium">Featured</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-7 sm:p-9 flex flex-col flex-grow">
                <div className="flex items-center gap-5 mb-5 text-xs text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-red-500/60" />
                    {featured.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-red-500/60" />
                    {featured.readTime}
                  </div>
                </div>

                <h3 className="font-orbitron text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 group-hover:text-red-400 transition-colors uppercase leading-tight line-clamp-2">
                  {featured.title}
                </h3>

                <p className="text-muted-foreground text-base mb-7 line-clamp-2 leading-relaxed flex-grow">
                  {featured.excerpt}
                </p>

                <div className="flex items-center gap-2 text-sm font-bold text-red-500 uppercase tracking-widest group-hover:gap-4 transition-all">
                  Read Full Story
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom bar */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-purple-500 group-hover:w-full transition-all duration-700" />
            </div>
          </div>

          {/* Other Posts */}
          <div className="lg:col-span-5 flex overflow-x-auto lg:flex-col gap-4 -mx-4 px-4 lg:mx-0 lg:px-0 pb-4 lg:pb-0 snap-x no-scrollbar">
            {others.map((item) => (
              <div 
                key={item.id} 
                className="news-item flex-[0_0_80vw] sm:flex-[0_0_55vw] lg:flex-none min-w-0 snap-center group cursor-pointer"
                onClick={() => setSelectedNews(item)}
              >
                <div className="flex items-start gap-4 p-5 bg-white/[0.02] border border-white/6 rounded-2xl hover:border-red-500/20 transition-all duration-400 hover:bg-white/[0.04]">
                  {/* Thumbnail */}
                  <div className="hidden sm:block flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-white/8 group-hover:border-red-500/20 transition-colors">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-50 group-hover:opacity-80"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                        {item.date}
                      </span>
                      <span className="text-[9px] text-gray-700 uppercase tracking-widest">
                        {item.readTime}
                      </span>
                    </div>

                    <h4 className="font-orbitron text-xs sm:text-sm font-bold text-foreground mb-1.5 group-hover:text-red-400 transition-colors uppercase line-clamp-2 leading-snug">
                      {item.title}
                    </h4>

                    <span className="text-[10px] text-gray-600 uppercase font-medium tracking-widest">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All */}
        {onViewAll && (
          <div className="text-center mt-12">
            <button
              onClick={onViewAll}
              className="group inline-flex items-center gap-2 px-8 py-3.5 border border-foreground/10 dark:border-white/10 text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-foreground/5 dark:hover:bg-white/[0.03] cyber-btn rounded-xl"
            >
              View All Posts
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>

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
                <DialogTitle asChild>
                  <h2 className="font-orbitron text-base sm:text-lg lg:text-xl font-black text-white mb-4 lg:mb-6 leading-tight tracking-wide shrink-0">
                    {selectedNews.title}
                  </h2>
                </DialogTitle>

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
                     This is an expanded view. Content can be injected here dynamically. The layout puts the picture on the left while perfectly scaling down constraints to give you the ideal proportion you requested.
                  </p>
                  <p>
                     Stay tuned for more updates from the RAS ENIS chapter. We are constantly innovating and pushing the boundaries of what is possible in the field of robotics and automation.
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
    </section>
  );
}
