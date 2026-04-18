import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, Users, ChevronRight, ArrowRight, X, Image as ImageIcon, Activity } from 'lucide-react';
import { events, type Event } from '../data/events';
import { Dialog, DialogContent } from './ui/dialog';

gsap.registerPlugin(ScrollTrigger);

export default function Events({ onViewAll }: { onViewAll: () => void }) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // 3D Tilt Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 1000
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.event-item',
        { opacity: 0, x: -40, scale: 0.95 },
        {
          opacity: 1, x: 0, scale: 1, duration: 1.2, stagger: 0.2, ease: 'expo.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
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

  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 2);

  return (
    <section id="events" ref={sectionRef} className="relative py-14 lg:py-20 overflow-hidden bg-transparent">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="section-tag mb-6 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            What's Happening
          </span>
          <h2 className="font-orbitron text-4xl sm:text-5xl lg:text-6xl font-black text-foreground mb-5 mt-4">
            Upcoming{' '}<span className="text-gradient">Events</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Join our workshops, hackathons, and competitions. Learn from experts and showcase your skills.
          </p>
        </div>

        {/* Events List */}
        <div
          ref={containerRef}
          className="flex flex-row sm:flex-col overflow-x-auto sm:overflow-visible snap-x snap-mandatory no-scrollbar gap-4 sm:gap-5 justify-start sm:justify-normal pb-6 sm:pb-0 w-full max-w-4xl mx-auto px-4 sm:px-0"
        >
          {upcomingEvents.map((event, index) => (
            <div 
              key={event.id} 
              className="event-item flex-[0_0_85vw] sm:flex-[1_1_100%] sm:w-full min-w-0 snap-center group relative cursor-pointer" 
              onMouseMove={handleMouseMove} 
              onMouseLeave={handleMouseLeave} 
              style={{ transformStyle: 'preserve-3d' }}
              onClick={() => setSelectedEvent(event)}
            >
              <div 
                className="relative bg-[#0a0a0b]/40 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-red-500/20 transition-all duration-700 shadow-2xl hover:shadow-red-500/5 flex flex-col sm:flex-row h-full"
              >
                {/* Left Side: Imagery */}
                <div className="relative w-full sm:w-[40%] aspect-[4/3] sm:aspect-auto overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1 opacity-40 group-hover:opacity-100 group-hover:brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent sm:bg-gradient-to-r sm:from-[#0a0a0b] sm:via-transparent sm:to-transparent z-10" />
                  
                  <div className="absolute top-6 left-6 z-20">
                    <span className="px-3 py-1 text-[9px] font-black text-red-400 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-full uppercase tracking-widest shadow-lg">
                      {event.category}
                    </span>
                  </div>
                </div>

                {/* Right Side: Content */}
                <div className="p-8 sm:p-10 flex flex-col flex-grow relative z-20">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Upcoming Assignment</span>
                  </div>

                  <h3 className="font-orbitron text-xl sm:text-2xl font-black text-foreground mb-4 group-hover:text-red-400 transition-colors uppercase leading-[1.1] tracking-tight">
                    {event.title}
                  </h3>

                  <p className="text-muted-foreground text-[13px] leading-relaxed mb-8 line-clamp-2 font-medium opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                    {event.description}
                  </p>

                  <div className="flex flex-wrap gap-6 mt-auto pt-6 border-t border-white/[0.03]">
                    <div className="flex items-center gap-2.5 text-[10px] text-gray-500 font-black uppercase tracking-widest group-hover:text-red-400 transition-colors">
                      <Calendar className="w-4 h-4 text-red-500/60" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[10px] text-gray-500 font-black uppercase tracking-widest group-hover:text-red-400 transition-colors">
                      <MapPin className="w-4 h-4 text-red-500/60" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[10px] text-gray-500 font-black uppercase tracking-widest group-hover:text-red-400 transition-colors">
                      <Users className="w-4 h-4 text-red-500/60" />
                      <span>{event.registeredCount} Personnel</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Border Action Line */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-500/0 via-red-500/40 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-8">
          <button
            onClick={onViewAll}
            className="group inline-flex items-center gap-2 px-8 py-3.5 border border-foreground/10 dark:border-white/10 text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-foreground/5 dark:hover:bg-white/[0.03] cyber-btn rounded-xl"
          >
            View All Events
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
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
                
                {/* Visual Status Badges */}
                <div className="absolute bottom-10 left-10 z-20 flex gap-3 translate-y-4 group-hover:translate-y-0 transition-transform hidden lg:flex">
                  <span className="px-4 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-lg shadow-2xl">
                    {selectedEvent.status}
                  </span>
                  <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-lg backdrop-blur-md">
                    {selectedEvent.category}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0515] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#0c0515] lg:via-transparent lg:to-transparent pointer-events-none" />
              </div>

              {/* Right Side: Main Content Area */}
              <div className="lg:w-[50%] px-6 pt-6 pb-2 sm:px-10 sm:pt-6 sm:pb-4 lg:px-12 lg:pt-8 lg:pb-4 relative z-10 flex flex-col -mt-24 sm:-mt-32 lg:mt-0 flex-grow bg-gradient-to-t from-[#0c0515] via-[#0c0515] to-transparent lg:bg-none min-h-0 overflow-hidden">
                
                <h2 className="font-orbitron text-lg sm:text-xl lg:text-2xl font-black text-white mb-6 leading-tight tracking-tight shrink-0 uppercase">
                  {selectedEvent.title}
                </h2>

                {/* Asymmetric Tactical Dashboard */}
                <div className="space-y-3 mb-10 shrink-0">
                  {/* Row 1: Smaller Info Chips */}
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

                  {/* Row 2: Weighted Action Bar - Reduced Height */}
                  <div className="flex gap-3 h-12 sm:h-14">
                    {/* Wider RSVP Box */}
                    <div className="flex-grow min-w-0">
                       {selectedEvent.status === 'upcoming' ? (
                          <button className="w-full h-full flex items-center gap-3 px-5 bg-red-600/90 hover:bg-red-500 text-white rounded-xl transition-all group/rsvp relative overflow-hidden shadow-lg shadow-red-600/10 active:scale-[0.98]">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/rsvp:translate-x-full transition-transform duration-1000" />
                            <div className="w-7 h-7 flex items-center justify-center bg-white/20 rounded-lg group-hover/rsvp:rotate-90 transition-transform hidden sm:flex">
                              <ChevronRight className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                              <p className="text-[7px] font-black text-white/50 uppercase tracking-widest leading-none mb-1">Authorization</p>
                              <p className="text-white text-[10px] font-black tracking-[0.2em] uppercase italic">Initiate Presence</p>
                            </div>
                          </button>
                        ) : (
                          <div className="w-full h-full flex items-center gap-4 px-5 bg-white/[0.05] border border-white/5 rounded-xl opacity-50 grayscale cursor-not-allowed">
                            <div className="w-7 h-7 flex items-center justify-center bg-gray-500/10 text-gray-400 rounded-lg">
                              <X className="w-3.5 h-3.5" />
                            </div>
                            <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Session Concluded</p>
                          </div>
                        )}
                    </div>

                    {/* Square Attendance Box */}
                    <div className="aspect-square h-full flex flex-col items-center justify-center bg-white/[0.03] border border-white/10 rounded-xl group/chip relative overflow-hidden transition-colors hover:bg-white/[0.06]">
                      <div className="absolute top-0 right-0 p-1">
                        <div className={`w-1 h-1 rounded-full animate-pulse ${selectedEvent.status === 'upcoming' ? 'bg-blue-500' : 'bg-green-500'}`} />
                      </div>
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
                    <div className="relative group/gallery">
                       <div 
                         ref={galleryRef}
                         className="flex flex-row overflow-x-auto gap-2 no-scrollbar snap-x scroll-smooth"
                       >
                         {selectedEvent.photos.map((photo, idx) => (
                           <div 
                             key={idx} 
                             onClick={() => setActiveImage(photo)}
                             className={`w-20 h-14 shrink-0 rounded-xl overflow-hidden border transition-all duration-300 group cursor-pointer snap-center relative ${activeImage === photo ? 'border-red-500 ring-2 ring-red-500/20' : 'border-white/10 opacity-40 hover:opacity-100'}`}
                           >
                             <img src={photo} className="w-full h-full object-cover" alt="" />
                           </div>
                         ))}
                       </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-4 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                       <ImageIcon className="w-4 h-4 text-white/20" />
                       <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">No Intelligence gathered (Photos)</span>
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
