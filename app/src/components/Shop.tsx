import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';
import { shopItems } from '../data/shop';

gsap.registerPlugin(ScrollTrigger);

export default function Shop() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.shop-card',
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: itemsRef.current, start: 'top 80%' },
        }
      );

      // Section parallax
      gsap.to(sectionRef.current, {
        y: -30,
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

  // 3D tilt on cards
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLDivElement>('.shop-card');
    cards.forEach((card) => {
      const mm = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
        card.style.transform = `perspective(700px) rotateX(${y}deg) rotateY(${x}deg) translateZ(8px)`;
      };
      const ml = () => { card.style.transform = ''; };
      card.addEventListener('mousemove', mm);
      card.addEventListener('mouseleave', ml);
    });
  }, []);

  return (
    <section id="shop" ref={sectionRef} className="relative py-14 lg:py-20 overflow-hidden bg-transparent">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <span className="section-tag mb-4 md:mb-6 inline-flex">
            <Sparkles className="w-3 h-3 text-red-400" />
            Official Merch
          </span>
          <h2 className="font-orbitron text-4xl sm:text-5xl lg:text-6xl font-black text-foreground mb-4 md:mb-6 mt-2 md:mt-4 uppercase">
            Chapter{' '}<span className="text-gradient">Shop</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Support our club and represent RAS ENIS with high-quality gear, components, and official merchandise.
          </p>
        </div>

        {/* Shop Grid */}
        <div
          ref={itemsRef}
          className="flex sm:grid overflow-x-auto sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 pb-6 sm:pb-0 snap-x snap-mandatory no-scrollbar"
        >
          {shopItems.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => navigate('/products')}
              data-cursor-text="VIEW"
              className="shop-card flex-[0_0_75vw] sm:flex-none min-w-0 snap-center group relative bg-foreground/[0.02] dark:bg-white/[0.02] border border-foreground/5 dark:border-white/10 rounded-xl overflow-hidden hover:border-red-500/30 flex flex-col cursor-pointer transition-all"
              style={{ transition: 'transform 0.2s ease, border-color 0.4s, box-shadow 0.4s' }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
                style={{ boxShadow: 'inset 0 0 50px rgba(239,68,68,0.06)' }}
              />

              {/* Image Area */}
              <div className="relative aspect-[4/4] overflow-hidden bg-foreground/[0.02] dark:bg-white/[0.01]">
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 text-[9px] font-bold text-red-400 uppercase tracking-widest rounded-md">
                    {item.category}
                  </span>
                </div>

                {/* "New" or item badge if present */}
                {(item.badge || item.id === shopItems[0].id) && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-2.5 py-1 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest rounded-md shadow-md">
                      {item.badge || 'New'}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent opacity-70 z-10" />
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Info */}
              <div className="p-5 sm:p-6 flex flex-col flex-grow">
                <h3 className="font-orbitron font-bold text-foreground group-hover:text-red-400 transition-colors uppercase text-sm leading-tight mb-2">
                  {item.name}
                </h3>

                <p className="text-muted-foreground text-xs mb-5 line-clamp-2 leading-relaxed flex-grow">
                  {item.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-foreground/5 dark:border-white/5">
                  <span className="font-numeric font-black text-foreground text-xl tracking-tight">
                    {item.price}
                  </span>
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground/5 dark:bg-white/5 group-hover:bg-red-500/20 border border-foreground/10 dark:border-white/10 group-hover:border-red-500/30 transition-all duration-300">
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-red-400 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Bottom line */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-purple-500 group-hover:w-full transition-all duration-700" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button
            onClick={() => navigate('/products')}
            className="group cyber-btn inline-flex items-center gap-3 px-10 py-4 border border-foreground/10 dark:border-white/10 bg-foreground/5 dark:bg-white/[0.02] hover:bg-red-500/10 text-foreground dark:text-white text-xs font-bold uppercase tracking-[0.3em] rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
