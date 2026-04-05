import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, ArrowLeft } from 'lucide-react';
import { projects } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

export default function AllProjects({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Projects');
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
    <div ref={sectionRef} className="min-h-screen bg-dark pt-0 pb-10">
      {/* Search & Filter Header */}
      <div className="relative border-b border-white/5 bg-[#0a0a0a]/60 sticky top-0 z-40 backdrop-blur-2xl pt-4">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-red-500 hover:text-white transition-all group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              <div>
                <h1 className="font-orbitron text-2xl font-bold text-white uppercase tracking-tight">Project <span className="text-red-500">Archive</span></h1>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Total {projects.length} Innovations</p>
              </div>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search innovations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
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
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-red-500/50'
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
                className="project-grid-item group bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden hover:border-red-500/30 hover:bg-white/[0.05] transition-all duration-500 flex flex-col"
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
                    <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                    <span className="text-[10px] text-gray-500 uppercase font-bold">{project.number}</span>
                  </div>

                  <h3 className="font-orbitron text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 group-hover:text-red-500 transition-colors uppercase leading-tight">
                    {project.title}
                  </h3>

                  <p className="text-gray-400 text-xs sm:text-sm mb-6 sm:mb-8 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-white/5 space-y-6">
                    <div className="flex flex-wrap gap-2 text-[9px] text-gray-500 font-bold uppercase">
                      {project.technologies.map((tech) => (
                         <span key={tech} className="px-3 py-1 bg-white/5 rounded-md border border-white/5">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="text-xl font-orbitron text-white">No projects found.</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
