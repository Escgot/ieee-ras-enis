import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { row1Images, row2Images } from '../data/gallery';

export default function Gallery() {
  const [emblaRef1] = useEmblaCarousel({ loop: true, align: 'start' }, [
    AutoScroll({ speed: 1, stopOnInteraction: false, stopOnMouseEnter: false, startDelay: 0 })
  ]);

  const [emblaRef2] = useEmblaCarousel({ loop: true, align: 'start', direction: 'rtl' }, [
    AutoScroll({ speed: 1, stopOnInteraction: false, stopOnMouseEnter: false, startDelay: 0 })
  ]);

  return (
    <section id="gallery" className="relative py-14 lg:py-20 overflow-hidden bg-transparent">
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      <div className="relative flex flex-col gap-8 sm:gap-12">
        {/* Row 1 - Content moves left */}
        <div className="embla overflow-hidden w-full cursor-grab active:cursor-grabbing" ref={emblaRef1}>
          <div className="embla__container flex gap-4 sm:gap-6 ml-4 sm:ml-6">
            {row1Images.map((img, i) => (
              <div
                key={i}
                className="embla__slide flex-[0_0_260px] sm:flex-[0_0_380px] h-[180px] sm:h-[260px] rounded-2xl overflow-hidden border border-foreground/10 dark:border-white/10 group relative flex-shrink-0"
              >
                <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Center Title Layout */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4 w-full">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-500/20 to-red-500/40" />
              <span className="section-tag shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Moments
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-red-500/20 to-red-500/40" />
            </div>

            <h2 className="font-orbitron text-4xl sm:text-5xl lg:text-7xl font-black text-foreground leading-none uppercase tracking-tighter">
              Our <span className="text-gradient">Gallery</span>
            </h2>

            <div className="flex flex-col items-center gap-2">
              <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold">
                Capturing innovation and community since 2013
              </p>
              <div className="w-12 h-1 bg-gradient-to-r from-red-600 to-purple-600 rounded-full" />
            </div>
          </div>
        </div>

        {/* Row 2 - Content moves right */}
        <div className="embla overflow-hidden w-full cursor-grab active:cursor-grabbing" ref={emblaRef2} dir="rtl">
          <div className="embla__container flex gap-4 sm:gap-6 mr-4 sm:mr-6">
            {row2Images.map((img, i) => (
              <div
                key={i}
                className="embla__slide flex-[0_0_260px] sm:flex-[0_0_380px] h-[180px] sm:h-[260px] rounded-2xl overflow-hidden border border-foreground/10 dark:border-white/10 group relative flex-shrink-0"
              >
                {/* Note: In RTL, images might look flipped if not careful, but object-cover is fine */}
                <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
