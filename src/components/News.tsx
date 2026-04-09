import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Clock, Calendar, TrendingUp } from 'lucide-react';
import { news } from '../data/news';

gsap.registerPlugin(ScrollTrigger);

export default function News() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
            <h2 className="font-orbitron text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight uppercase">
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
          <div className="news-featured lg:col-span-7 group cursor-pointer">
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

                <h3 className="font-orbitron text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors uppercase leading-tight line-clamp-2">
                  {featured.title}
                </h3>

                <p className="text-gray-500 text-base mb-7 line-clamp-2 leading-relaxed flex-grow">
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
              <div key={item.id} className="news-item flex-[0_0_80vw] sm:flex-[0_0_55vw] lg:flex-none min-w-0 snap-center group cursor-pointer">
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

                    <h4 className="font-orbitron text-xs sm:text-sm font-bold text-white mb-1.5 group-hover:text-red-400 transition-colors uppercase line-clamp-2 leading-snug">
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
      </div>
    </section>
  );
}
