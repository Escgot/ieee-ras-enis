import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Calendar, MapPin, Filter, ArrowLeft, X, Image as ImageIcon } from 'lucide-react';
import { events, type Event } from '../data/events';
import { Dialog, DialogContent } from './ui/dialog';

gsap.registerPlugin(ScrollTrigger);

const categories = ['All Events', 'Workshops', 'Competitions', 'Social'];

export default function AllEvents({ onBack }: { onBack?: () => void }) {
  const [activeCategory, setActiveCategory] = useState('All Events');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const filteredEvents = events.filter((event) => {
    const matchesCategory = activeCategory === 'All Events' || 
      (activeCategory === 'Workshops' && event.category === 'Workshop') ||
      (activeCategory === 'Competitions' && event.category === 'Competition') ||
      (activeCategory === 'Social' && event.category === 'Social');
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.event-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredEvents]);

  return (
    <section id="events" ref={sectionRef} className="relative py-14 lg:py-20 overflow-hidden bg-transparent">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/10 to-transparent" />
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 relative">
            {onBack && (
              <button
                onClick={onBack}
                className="absolute left-0 top-0 p-2 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span>Back</span>
              </button>
            )}
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-red-500 bg-red-500/10 border border-red-500/20 rounded-full">
              Full Archive
            </span>
            <h2 className="font-orbitron text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              All <span className="text-gradient">Events</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join us for exciting workshops, competitions, and networking events. Stay updated
              with the latest in robotics and automation.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-4 mb-10">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 rounded-xl text-foreground dark:text-white placeholder-muted-foreground focus:outline-none focus:border-red-500/50 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar lg:pb-0">
              <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl whitespace-nowrap transition-all border shrink-0 ${
                    activeCategory === category
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'bg-foreground/5 dark:bg-white/5 border-foreground/10 dark:border-white/10 text-muted-foreground hover:bg-foreground/10 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="group relative bg-[#0a0a0b]/40 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-red-500/20 transition-all duration-700 cursor-pointer shadow-2xl hover:shadow-red-500/5 h-full flex flex-col"
                onClick={() => setSelectedEvent(event)}
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1 opacity-40 group-hover:opacity-100 group-hover:brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent z-10" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6 z-20">
                    <span className="px-3 py-1 text-[9px] font-black text-red-400 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-full uppercase tracking-widest shadow-lg">
                      {event.category}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className={`w-1 h-1 rounded-full animate-pulse ${event.status === 'upcoming' ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">{event.status}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-7 flex flex-col flex-grow relative z-20">
                  <h3 className="font-orbitron text-xl font-black text-foreground mb-4 group-hover:text-red-400 transition-colors uppercase leading-[1.1] tracking-tight">
                    {event.title}
                  </h3>

                  <p className="text-muted-foreground text-[13px] leading-relaxed mb-6 line-clamp-2 font-medium opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                    {event.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-auto pt-6 border-t border-white/[0.03]">
                    <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5 text-red-500/60" />
                      <span>{event.date.split(',')[0]}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5 text-red-500/60" />
                      <span>{event.location.split(' ').slice(-1)}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Border Glow */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-500/0 via-red-500/40 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-white/5 rounded-full">
                <Search className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="font-orbitron text-xl font-semibold text-foreground mb-2">
                No events found
              </h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}

        </div>
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-6xl w-[95vw] lg:w-[90vw] lg:aspect-[2/1] bg-[#0c0515]/95 border-red-500/20 backdrop-blur-3xl p-0 overflow-hidden rounded-3xl outline-none shadow-[0_0_80px_rgba(239,68,68,0.15)] flex flex-col my-4">
          {selectedEvent && (
            <div className="relative w-full h-full max-h-[95vh] lg:max-h-none overflow-hidden no-scrollbar flex flex-col lg:flex-row">
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-white bg-black/20 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side: Hero Image - Draggable Pan Effect */}
              <div 
                ref={imageContainerRef}
                className="w-full lg:w-[50%] h-[350px] sm:h-[450px] lg:h-full relative shrink-0 overflow-hidden cursor-grab active:cursor-grabbing bg-black flex items-center justify-center"
              >
                <motion.img 
                  key={activeImage || selectedEvent.image}
                  src={activeImage || selectedEvent.image} 
                  alt={selectedEvent.title} 
                  drag="x"
                  dragConstraints={imageContainerRef}
                  className="h-full w-auto max-w-none object-cover opacity-60 lg:opacity-80 transition-opacity duration-700"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0515] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#0c0515] lg:via-transparent lg:to-transparent pointer-events-none" />
              </div>

              {/* Right Side: Main Content Area */}
              <div className="lg:w-[50%] px-6 pt-6 pb-2 sm:px-10 sm:pt-6 sm:pb-4 lg:px-12 lg:pt-8 lg:pb-4 relative z-10 flex flex-col -mt-24 sm:-mt-32 lg:mt-0 flex-grow bg-gradient-to-t from-[#0c0515] via-[#0c0515] to-transparent lg:bg-none min-h-0 overflow-hidden">
                
                <h2 className="font-orbitron text-lg sm:text-xl lg:text-2xl font-black text-white mb-6 leading-tight tracking-tight shrink-0 uppercase">
                  {selectedEvent.title}
                </h2>

                {/* Combined Command Bar (2x2 Grid) */}
                <div className="space-y-3 mb-10 shrink-0">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all group/chip">
                      <Calendar className="w-4 h-4 text-red-500 shrink-0" />
                      <div>
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Timeframe</p>
                        <p className="text-white text-[10px] font-bold leading-none">{selectedEvent.date.split(',')[0]}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all group/chip">
                      <MapPin className="w-4 h-4 text-purple-500 shrink-0" />
                      <div>
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Deployment</p>
                        <p className="text-white text-[10px] font-bold leading-none truncate">{selectedEvent.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 h-12 sm:h-14">
                    <div className="flex-grow min-w-0">
                       {selectedEvent.status === 'upcoming' ? (
                          <button className="w-full h-full flex items-center gap-3 px-5 bg-red-600/90 hover:bg-red-500 text-white rounded-xl transition-all group/rsvp relative overflow-hidden shadow-lg shadow-red-600/10 active:scale-[0.98]">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/rsvp:translate-x-full transition-transform duration-1000" />
                            <div className="text-left">
                              <p className="text-[7px] font-black text-white/50 uppercase tracking-widest leading-none mb-1">Authorization</p>
                              <p className="text-white text-[10px] font-black tracking-[0.2em] uppercase italic">Initiate Presence</p>
                            </div>
                          </button>
                        ) : (
                          <div className="w-full h-full flex items-center gap-4 px-5 bg-white/[0.05] border border-white/5 rounded-xl opacity-50 grayscale cursor-not-allowed">
                            <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Session Concluded</p>
                          </div>
                        )}
                    </div>

                    <div className="aspect-square h-full flex flex-col items-center justify-center bg-white/[0.03] border border-white/10 rounded-xl group/chip relative overflow-hidden">
                      <p className="text-white text-base font-black leading-none mb-1">{selectedEvent.registeredCount}</p>
                      <p className="text-[6px] font-black text-gray-500 uppercase tracking-[0.2em] text-center px-1">
                        {selectedEvent.status === 'upcoming' ? 'Reg.' : 'Att.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 font-medium flex-grow overflow-y-auto min-h-0 pr-6 custom-scrollbar">
                  <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 to-transparent opacity-40" />
                    <p className="text-gray-200 text-sm sm:text-base font-medium leading-relaxed mb-4">
                      {selectedEvent.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Gallery */}
                <div className="shrink-0 relative">
                  {selectedEvent.photos && selectedEvent.photos.length > 0 ? (
                    <div className="flex flex-row overflow-x-auto gap-2 no-scrollbar snap-x scroll-smooth">
                      {selectedEvent.photos.map((photo, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setActiveImage(photo)}
                          className={`w-16 h-12 shrink-0 rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer snap-center ${activeImage === photo ? 'border-red-500 ring-2 ring-red-500/20' : 'border-white/10 opacity-40 hover:opacity-100'}`}
                        >
                          <img src={photo} className="w-full h-full object-cover" alt="" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-3 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                       <ImageIcon className="w-4 h-4 text-white/20" />
                       <span className="text-[9px] font-bold text-white/25 uppercase tracking-widest">No Photos gathered</span>
                    </div>
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
