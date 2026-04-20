import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ExternalLink, X, Cpu, Settings, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { projects, type Project } from '../data/projects';
import { Dialog, DialogContent } from './ui/dialog';

gsap.registerPlugin(ScrollTrigger);

export default function Projects({ onViewAll }: { onViewAll?: () => void }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const projectGalleryRef = useRef<HTMLDivElement>(null);

  const scrollGallery = (direction: 'left' | 'right') => {
    if (projectGalleryRef.current) {
      const scrollAmount = 200;
      projectGalleryRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };


  useEffect(() => {
    if (selectedProject) {
      setActiveImage(selectedProject.image);
    }
  }, [selectedProject]);

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
              className="project-card flex-[0_0_85vw] md:flex-none min-w-0 snap-center group relative bg-[#0a0a0b]/40 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-red-500/20 transition-all duration-700 cursor-pointer shadow-2xl hover:shadow-red-500/5"
              onClick={() => setSelectedProject(project)}
            >
              {/* Top Section: Imagery */}
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* Image */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1 opacity-40 group-hover:opacity-100 group-hover:brightness-75"
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent z-10" />
                <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                
                {/* Floating Tags */}
                <div className="absolute top-6 left-6 z-20 flex flex-col gap-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="px-3 py-1 text-[9px] font-black text-red-400 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-full uppercase tracking-widest shadow-lg">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                    <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">{project.status}</span>
                  </div>
                </div>

                {/* Big Background Number */}
                <span className="absolute -bottom-4 -right-2 font-orbitron text-8xl font-black text-white/[0.03] group-hover:text-red-500/5 transition-colors duration-1000 select-none z-0">
                  {project.number}
                </span>
              </div>

              {/* Bottom Section: Content */}
              <div className="p-8 pb-10 relative z-20 flex flex-col">
                <h3 className="font-orbitron text-xl font-black text-foreground mb-4 group-hover:text-red-400 transition-colors uppercase leading-[1.1] tracking-tight">
                  {project.title}
                </h3>

                <p className="text-muted-foreground text-[13px] leading-relaxed mb-8 line-clamp-2 font-medium opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                  {project.description}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-2 mb-8 opacity-40 group-hover:opacity-100 transition-all duration-700 transform group-hover:translate-y-[-4px]">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-[8px] font-black text-gray-500 px-2 py-0.5 border border-white/5 rounded-md uppercase tracking-widest group-hover:border-red-500/30 group-hover:text-red-300 transition-colors">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-[8px] font-black text-gray-600 px-2 py-0.5 uppercase tracking-widest">+{project.technologies.length - 3} More</span>
                  )}
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-6 border-t border-white/[0.03] group-hover:border-red-500/10 transition-colors">
                  <div className="flex items-center gap-3 text-[10px] font-black text-red-500 uppercase tracking-[0.25em] transition-all">
                    <span className="relative">
                      Deep View
                      <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-500 group-hover:w-full" />
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                  </div>
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 group-hover:border-red-500/20 transition-all">
                    <ExternalLink className="w-3.5 h-3.5 text-gray-600 group-hover:text-red-400" />
                  </div>
                </div>
              </div>

              {/* Advanced Interactive Glow */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-500/0 via-red-500/40 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </div>
          ))}
        </div>


      </div>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="sm:max-w-6xl w-[95vw] lg:w-[90vw] lg:aspect-[2/1] bg-[#0c0515]/95 border-red-500/20 backdrop-blur-3xl p-0 overflow-hidden rounded-3xl outline-none shadow-[0_0_80px_rgba(239,68,68,0.15)] flex flex-col my-4">
          {selectedProject && (
            <div className="relative w-full h-full max-h-[95vh] lg:max-h-none overflow-hidden no-scrollbar flex flex-col lg:flex-row">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-white bg-black/20 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side: Hero Image - Swippable Gallery */}
              <div className="w-full lg:w-[60%] h-[350px] sm:h-[450px] lg:h-full relative shrink-0 overflow-hidden bg-[#050505] flex items-center justify-center group/hero">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage || selectedProject.image}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      const swipe = info.offset.x;
                      const photos = selectedProject.photos || [selectedProject.image];
                      const currentIdx = photos.indexOf(activeImage || selectedProject.image);
                      
                      if (swipe < -50) { // Swipe Left -> Next
                        const nextIdx = (currentIdx + 1) % photos.length;
                        setActiveImage(photos[nextIdx]);
                      } else if (swipe > 50) { // Swipe Right -> Prev
                        const prevIdx = (currentIdx - 1 + photos.length) % photos.length;
                        setActiveImage(photos[prevIdx]);
                      }
                    }}
                    className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                  >
                    <img 
                      src={activeImage || selectedProject.image} 
                      alt={selectedProject.title} 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
                
                {/* Visual Status Badges */}
                <div className="absolute top-6 left-6 z-20 flex flex-col gap-2 translate-y-2 group-hover/hero:translate-y-0 transition-transform duration-500">
                  <span className="px-3 py-1 text-[9px] font-black text-red-400 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-full uppercase tracking-widest shadow-lg">
                    {selectedProject.category}
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/5 shadow-sm opacity-0 group-hover/hero:opacity-100 transition-opacity duration-700 delay-100">
                    <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">{selectedProject.status}</span>
                  </div>
                </div>

                {/* Navigation Overlay Hints */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/40 to-transparent pointer-events-none opacity-0 group-hover/hero:opacity-100 transition-opacity flex items-center justify-center">
                   <ChevronLeft className="w-6 h-6 text-white/20" />
                </div>
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/40 to-transparent pointer-events-none opacity-0 group-hover/hero:opacity-100 transition-opacity flex items-center justify-center">
                   <ChevronRight className="w-6 h-6 text-white/20" />
                </div>

                {/* Gradient merge effect for side-by-side layout */}
                <div className="hidden lg:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0c0515] to-transparent pointer-events-none z-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0515] via-transparent to-transparent lg:hidden pointer-events-none z-20" />
              </div>

              {/* Right Side: Main Content Area */}
              <div className="lg:w-[40%] px-6 pt-6 pb-2 sm:px-10 sm:pt-10 sm:pb-4 lg:px-12 lg:pt-12 lg:pb-4 relative z-10 flex flex-col -mt-20 sm:-mt-28 lg:mt-0 flex-grow bg-gradient-to-t from-[#0c0515] via-[#0c0515] to-transparent lg:bg-none min-h-0 overflow-hidden">

                {/* Category Badge */}
                <div className="mb-4 lg:mb-6 self-start shrink-0">
                  <span className="px-3 py-1.5 border border-red-500/30 text-red-300 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] rounded-md bg-red-500/10 backdrop-blur-md">
                    PROJECT // {selectedProject.category.toUpperCase()}
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-orbitron text-base sm:text-lg lg:text-xl font-black text-white mb-4 lg:mb-6 leading-tight tracking-wide shrink-0">
                  {selectedProject.title}
                </h2>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4 lg:mb-6 text-xs text-gray-300 font-medium shrink-0">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-red-500" />
                    <span className="uppercase text-[9px] tracking-widest">{selectedProject.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-red-500" />
                    <span className="uppercase text-[9px] tracking-widest">R&D Phase</span>
                  </div>
                </div>

                {/* Top Divider */}
                <div className="h-px w-full bg-white/5 mb-4 lg:mb-6 shrink-0" />

                {/* Content / Excerpt */}
                <div className="space-y-4 text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 lg:mb-6 font-medium flex-grow overflow-y-auto min-h-0 pr-4 custom-scrollbar">
                  <p className="text-gray-200">
                    {selectedProject.description}
                  </p>

                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block flex items-center gap-2 mt-6">
                    <Settings className="w-3 h-3 text-red-500" />
                    Integrated Technologies
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedProject.technologies.map((tech) => (
                      <span key={tech} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] text-gray-300 uppercase font-black tracking-widest hover:border-red-500 hover:text-white transition-all duration-300 cursor-default">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Divider */}
                <div className="h-px w-full bg-white/5 mb-3 shrink-0" />

                {/* Bottom Photos Gallery */}
                <div className="shrink-0 relative">
                  {selectedProject.photos && selectedProject.photos.length > 0 ? (
                    <div className="relative group/gallery">
                      <button 
                        onClick={() => scrollGallery('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-black/70 hover:bg-red-500 text-white rounded-full opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 border border-white/20 -ml-3 backdrop-blur-md"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>

                      <div 
                        ref={projectGalleryRef}
                        className="flex flex-row overflow-x-auto gap-2 no-scrollbar snap-x scroll-smooth"
                      >
                        {selectedProject.photos.map((photo, idx) => (
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
                              <div className="absolute inset-0 border-2 border-red-500 rounded-lg pointer-events-none shadow-[inset_0_0_10px_rgba(239,68,68,0.5)]"></div>
                            )}
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={() => scrollGallery('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-black/70 hover:bg-red-500 text-white rounded-full opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 border border-white/20 -mr-3 backdrop-blur-md"
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
