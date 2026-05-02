import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, ArrowLeft, X, Cpu, Settings, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { projects, type Project } from '../data/projects';
import { Dialog, DialogContent } from './ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

export default function AllProjects({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
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

  const categories = ['All Projects', 'Autonomous', 'LINE FOLLOWER', 'ALL TERRAIN', 'FIGHTER'];

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.project-grid-item',
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      setActiveImage(selectedProject.image);
    } else {
      setActiveImage(null);
    }
  }, [selectedProject]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All Projects' || 
      project.category.toLowerCase() === activeCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div ref={sectionRef} className="min-h-screen bg-transparent pt-0 pb-10">
      {/* Search & Filter Header */}
      <div className="relative border-b border-white/5 bg-transparent sticky top-0 z-40 backdrop-blur-2xl pt-2 md:pt-4">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="p-3 bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 rounded-full hover:bg-red-500 hover:text-white transition-all group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              <div>
                <h1 className="font-orbitron text-2xl font-bold text-foreground uppercase tracking-tight">Project <span className="text-red-500">Archive</span></h1>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Total {projects.length} Innovations</p>
              </div>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search innovations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 rounded-2xl text-foreground dark:text-white placeholder-muted-foreground focus:outline-none focus:border-red-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="mt-4 md:mt-8 flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar lg:pb-0 lg:flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border flex-shrink-0 whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-red-500 border-red-500 text-white shadow-glow'
                      : 'bg-foreground/5 dark:bg-white/5 border-foreground/10 dark:border-white/10 text-muted-foreground hover:border-red-500/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-6 md:mt-8">
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="project-grid-item group bg-foreground/[0.03] dark:bg-white/[0.03] border border-foreground/5 dark:border-white/5 rounded-3xl overflow-hidden hover:border-red-500/30 hover:bg-foreground/[0.05] dark:hover:bg-white/[0.05] transition-all duration-500 flex flex-col cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                {/* Image Placeholder */}
                <div className="relative aspect-video overflow-hidden border-b border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent z-10" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                     <button className="px-6 py-3 bg-red-600 text-white font-bold text-xs uppercase rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl">
                       View Case Study
                     </button>
                  </div>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-40 group-hover:opacity-60" 
                    loading="lazy"
                    decoding="async"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg border ${
                      project.status === 'completed' 
                      ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                      : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                      {project.category}
                    </span>
                    <span className="w-1.5 h-1.5 bg-foreground/20 dark:bg-white/20 rounded-full" />
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">{project.number}</span>
                  </div>

                  <h3 className="font-orbitron text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4 group-hover:text-red-500 transition-colors uppercase leading-tight">
                    {project.title}
                  </h3>

                  <p className="text-muted-foreground text-xs sm:text-sm mb-6 sm:mb-8 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-white/5 space-y-6">
                    <div className="flex flex-wrap gap-2 text-[9px] text-muted-foreground font-bold uppercase">
                      {project.technologies.map((tech) => (
                         <span key={tech} className="px-3 py-1 bg-foreground/5 dark:bg-white/5 rounded-md border border-foreground/5 dark:border-white/5">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="text-xl font-orbitron text-foreground">No projects found.</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search or category filter.</p>
          </div>
        )}
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
    </div>
  );
}
