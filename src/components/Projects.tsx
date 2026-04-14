import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { projects } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

export default function Projects({ onViewAll }: { onViewAll?: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.project-card',
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.18, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
        }
      );

      // Section parallax
      gsap.to(sectionRef.current, {
        y: -50,
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

  // 3D magnetic tilt
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLDivElement>('.project-card');
    cards.forEach((card) => {
      const mm = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
        card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
      };
      const ml = () => { card.style.transform = ''; };
      card.addEventListener('mousemove', mm);
      card.addEventListener('mouseleave', ml);
      return () => {
        card.removeEventListener('mousemove', mm);
        card.removeEventListener('mouseleave', ml);
      };
    });
  }, []);

  const featuredProjects = projects.slice(0, 3);

  return (
    <section id="projects" ref={sectionRef} className="relative py-14 lg:py-20 overflow-hidden bg-transparent">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-row justify-between items-end mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-gradient-to-r from-red-500 to-transparent" />
              <span className="font-orbitron text-xs font-bold uppercase tracking-[0.35em] text-red-500">What We Build</span>
            </div>
            <h2 className="font-orbitron text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-none uppercase">
              Featured{' '}<br />
              <span className="text-gradient">Projects</span>
            </h2>
          </div>
          <button
            onClick={onViewAll}
            className="group cyber-btn flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-7 sm:py-3.5 border border-foreground/10 dark:border-white/10 text-muted-foreground hover:text-foreground transition-all rounded-xl font-bold text-[9px] sm:text-[11px] tracking-widest uppercase backdrop-blur-sm hover:bg-foreground/5 dark:hover:bg-red-500/5"
          >
            All Projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Projects Grid */}
        <div
          ref={gridRef}
          className="flex md:grid overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 md:grid-cols-3 gap-0 md:gap-6 snap-x snap-mandatory no-scrollbar"
        >
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="project-card flex-[0_0_85vw] md:flex-none min-w-0 snap-center group relative bg-white/[0.02] border border-white/6 rounded-3xl overflow-hidden hover:border-red-500/25 transition-all duration-500 cursor-pointer holographic"
              style={{ transition: 'transform 0.2s ease, border-color 0.4s, box-shadow 0.4s' }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" style={{ boxShadow: 'inset 0 0 40px rgba(239,68,68,0.04)' }} />

              {/* Number badge */}
              <div className="absolute top-5 right-5 font-orbitron text-5xl font-black text-white/[0.04] group-hover:text-red-500/10 transition-colors z-0 select-none pointer-events-none leading-none">
                {project.number}
              </div>

              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                 <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 transition-colors duration-500" />

                {/* Category tag */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-[10px] font-black text-red-400 uppercase tracking-widest bg-red-500/15 border border-red-500/25 backdrop-blur-md rounded-lg">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-7 lg:p-8 relative z-10">
                <h3 className="font-orbitron text-lg sm:text-xl font-bold text-foreground mb-3 group-hover:text-red-400 transition-colors uppercase leading-snug line-clamp-2">
                  {project.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-8 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-[0.2em] group-hover:gap-3 transition-all">
                    Explore
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-700 group-hover:text-gray-400 transition-colors" />
                </div>
              </div>

              {/* Bottom progress bar */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-purple-500 group-hover:w-full transition-all duration-700" />
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
