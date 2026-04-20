import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, ArrowLeft, X, Cpu, Settings, Target, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const categories = ['All Projects', 'Autonomous', 'Industrial Arm', 'Computer Vision', 'Humanoid'];

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
      <div className="relative border-b border-white/5 bg-transparent sticky top-0 z-40 backdrop-blur-2xl pt-4">
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

          <div className="mt-8 flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar lg:pb-0 lg:flex-wrap">
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
      <div className="max-w-7xl mx-auto px-4 mt-8">
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
        <DialogContent className="max-w-7xl bg-transparent border-none shadow-none p-0 overflow-visible">
          {selectedProject && (
            <div className="relative w-full max-h-[90vh] overflow-y-auto no-scrollbar bg-[#080809]/95 border border-white/10 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)]">
              {/* Close button - floating style */}
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-8 right-8 z-[60] p-4 bg-white/5 hover:bg-red-500 text-white rounded-full transition-all duration-300 border border-white/10 backdrop-blur-xl group hover:scale-110 active:scale-95 shadow-2xl"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
              </button>

              <div className="flex flex-col lg:flex-row min-h-[600px]">
                {/* Left Side: Visual Showcase - Swippable Gallery */}
                <div className="lg:w-[55%] relative overflow-hidden group/img min-h-[400px] lg:min-h-full bg-[#050505] flex items-center justify-center">
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
                  
                  {/* Bottom info Overlay */}
                  <div className="absolute bottom-10 left-10 z-20 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-5 py-2 text-white text-[10px] font-black uppercase tracking-[0.35em] rounded-full shadow-[0_0_25px_rgba(239,68,68,0.4)] ${selectedProject.status === 'completed' ? 'bg-green-500 shadow-green-500/20' : 'bg-yellow-500 shadow-yellow-500/20'}`}>
                        {selectedProject.status}
                      </span>
                      <div className="px-5 py-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-full text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                        R&D PHASE
                      </div>
                    </div>
                  </div>

                  {/* Navigation Overlay Hints */}
                  <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/40 to-transparent pointer-events-none opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                     <ChevronLeft className="w-6 h-6 text-white/20" />
                  </div>
                  <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/40 to-transparent pointer-events-none opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                     <ChevronRight className="w-6 h-6 text-white/20" />
                  </div>

                  {/* Gradient merge effect for side-by-side layout */}
                  <div className="hidden lg:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#080809] to-transparent pointer-events-none z-20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080809] via-transparent to-transparent lg:hidden pointer-events-none z-20" />
                </div>

                {/* Right Side: Technical Dossier */}
                <div className="lg:w-[45%] p-8 sm:p-12 lg:p-16 flex flex-col relative overflow-hidden bg-white/[0.01]">
                  {/* Decorative background elements */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em]">
                         Archive Dossier // {selectedProject.category}
                       </span>
                    </div>

                    <h2 className="font-orbitron text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-8 uppercase leading-[1.1] tracking-tight">
                      {selectedProject.title.split(' ').map((word, i) => (
                        <span key={i} className={i === selectedProject.title.split(' ').length - 1 ? "text-gradient block mt-1" : "block"}>
                          {word}
                        </span>
                      ))}
                    </h2>

                    <div className="space-y-10">
                      <div className="relative group/desc">
                        <div className="absolute -left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500/50 to-transparent opacity-0 group-hover/desc:opacity-100 transition-opacity" />
                        <p className="text-gray-400 text-base leading-relaxed font-medium">
                          {selectedProject.description}
                        </p>
                      </div>

                      {/* Technical Specs Grid */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block">Primary Core</label>
                          <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                            <Cpu className="w-5 h-5 text-red-500" />
                            <div className="text-xs text-white font-bold uppercase tracking-tight">NVIDIA ORIN</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block">Performance</label>
                          <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                            <Target className="w-5 h-5 text-red-500" />
                            <div className="text-xs text-white font-bold uppercase tracking-tight">99.8% ACC</div>
                          </div>
                        </div>
                      </div>

                      {/* Extended Technologies */}
                      <div className="space-y-4">
                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block flex items-center gap-2">
                           <Settings className="w-3 h-3 text-red-500" />
                           Integrated Technologies
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.technologies.map((tech) => (
                            <span key={tech} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] text-gray-300 uppercase font-black tracking-widest hover:border-red-500 hover:text-white transition-all duration-300 cursor-default">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Photos Gallery (Archive View) */}
                      <div className="shrink-0 relative">
                        {selectedProject.photos && selectedProject.photos.length > 0 && (
                          <div className="flex flex-row overflow-x-auto gap-2 no-scrollbar snap-x scroll-smooth">
                            {selectedProject.photos.map((photo, idx) => (
                              <div 
                                key={idx} 
                                onClick={() => setActiveImage(photo)}
                                className={`w-16 h-12 shrink-0 rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer snap-center ${activeImage === photo ? 'border-red-500 ring-2 ring-red-500/20' : 'border-white/10 opacity-40 hover:opacity-100'}`}
                              >
                                <img src={photo} className="w-full h-full object-cover" alt="" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-16 flex flex-col sm:flex-row gap-4">
                      <button className="flex-grow group relative overflow-hidden px-8 py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl transition-all font-black text-xs tracking-[0.3em] uppercase">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <span className="relative flex items-center justify-center gap-3">
                          Access Case Study
                          <ExternalLink className="w-4 h-4" />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
