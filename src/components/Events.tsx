import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, Users, ChevronRight, ArrowRight, X, Image as ImageIcon } from 'lucide-react';
import { events, type Event } from '../data/events';
import { Dialog, DialogContent } from './ui/dialog';

gsap.registerPlugin(ScrollTrigger);

export default function Events({ onViewAll }: { onViewAll: () => void }) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
          {upcomingEvents.map((event, index) => {
            const [month, day] = event.date.split(' ');
            const isFirst = index === 0;
            return (
              <div key={event.id} className="event-item flex-[0_0_85vw] sm:flex-[1_1_100%] sm:w-full min-w-0 snap-center group relative" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ transformStyle: 'preserve-3d' }}>
                {/* Connector */}
                {index !== upcomingEvents.length - 1 && (
                  <div className="absolute left-14 top-[120px] bottom-0 w-px bg-gradient-to-b from-red-500/30 to-transparent z-0 hidden sm:block" />
                )}

                <div 
                  className={`relative flex flex-col sm:flex-row gap-5 sm:gap-7 border rounded-3xl p-5 sm:p-7 transition-all duration-500 group-hover:-translate-y-1 cursor-pointer overflow-hidden ${isFirst
                    ? 'bg-white/[0.03] border-red-500/20 hover:border-red-500/40 hover:shadow-[0_20px_60px_rgba(239,68,68,0.08)]'
                    : 'bg-white/[0.02] border-white/6 hover:border-red-500/25 hover:shadow-[0_20px_40px_rgba(239,68,68,0.05)]'
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >

                  {/* Subtle gradient bg on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-purple-500/0 group-hover:from-red-500/[0.03] group-hover:to-purple-500/[0.02] transition-all duration-500 rounded-3xl pointer-events-none" />

                  {/* "Featured" badge for first event */}
                  {isFirst && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                      Featured
                    </div>
                  )}

                  {/* Date Box */}
                  <div className={`relative flex-shrink-0 self-start w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border flex flex-col items-center justify-center text-center shadow-lg transition-all duration-300 ${isFirst
                      ? 'bg-red-500/10 border-red-500/30 group-hover:border-red-500/60 group-hover:bg-red-500/15'
                      : 'bg-white/[0.04] border-white/8 group-hover:border-red-500/30 group-hover:bg-white/[0.06]'
                    }`}>
                    <span className="text-2xl sm:text-3xl font-black text-red-400 font-orbitron leading-none">{day.replace(',', '')}</span>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{month}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-grow relative">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg">
                        {event.category}
                      </span>
                    </div>

                    <h3 className="font-orbitron text-lg sm:text-xl font-bold text-foreground mb-3 group-hover:text-red-400 transition-colors">
                      {event.title}
                    </h3>

                    <p className="text-muted-foreground mb-5 line-clamp-2 text-sm leading-relaxed">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                      {[
                        { icon: Calendar, text: event.time },
                        { icon: MapPin, text: event.location },
                        { icon: Users, text: `${event.registeredCount}/${event.maxAttendees} registered` },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <item.icon className="w-3.5 h-3.5 text-red-500/60" />
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center sm:items-start shrink-0 sm:pt-7">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-red-600/20 hover:shadow-red-500/30 cyber-btn whitespace-nowrap">
                      RSVP Now
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
        <DialogContent className="max-w-6xl w-[95vw] sm:w-[90vw] md:w-[85vw] bg-[#0a0a0b]/95 border-white/10 backdrop-blur-2xl p-0 overflow-y-auto max-h-[90vh] rounded-3xl no-scrollbar">
          {selectedEvent && (
            <div className="relative flex flex-col">
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full transition-colors flex items-center justify-center backdrop-blur-xl"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full h-48 sm:h-64 relative overflow-hidden shrink-0">
                <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 z-20 flex gap-2">
                  <span className="px-4 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-lg shadow-2xl">
                    {selectedEvent.status === 'upcoming' ? 'Upcoming' : 'Past'}
                  </span>
                  <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-lg backdrop-blur-md">
                    {selectedEvent.category}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-10 flex flex-col gap-8 shrink-0">
                <h2 className="font-orbitron text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase leading-tight mt-2">
                  {selectedEvent.title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-1 md:col-span-2 space-y-6">
                    <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-medium">
                      {selectedEvent.description}
                    </p>
                    
                    {/* Event Info Details */}
                    <div className="flex flex-col gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <div className="flex items-center gap-4 text-gray-300">
                        <Calendar className="w-5 h-5 text-red-500" />
                        <span className="font-medium text-sm sm:text-base">{selectedEvent.date} @ {selectedEvent.time}</span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-300">
                        <MapPin className="w-5 h-5 text-red-500" />
                        <span className="font-medium text-sm sm:text-base">{selectedEvent.location}</span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-300">
                        <Users className="w-5 h-5 text-red-500" />
                        <span className="font-medium text-sm sm:text-base">{selectedEvent.registeredCount}/{selectedEvent.maxAttendees} Attendees</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 flex flex-col gap-4">
                    {selectedEvent.status === 'upcoming' && (
                      <button className="group cyber-btn flex items-center justify-center gap-3 w-full py-4 bg-red-600 hover:bg-red-500 border border-red-500/50 text-white rounded-2xl transition-all font-black text-[12px] tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                        RSVP Now
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                    <button className="group flex items-center justify-center gap-3 w-full py-4 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white rounded-2xl transition-all font-bold text-[10px] tracking-[0.2em] uppercase">
                      Add to Calendar
                    </button>
                  </div>
                </div>

                {/* Photos Gallery Area */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <ImageIcon className="w-5 h-5 text-red-500" />
                    <h3 className="font-orbitron font-bold text-xl uppercase tracking-widest text-white">Event Gallery</h3>
                  </div>
                  
                  {selectedEvent.photos && selectedEvent.photos.length > 0 ? (
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedEvent.photos.map((photo, idx) => (
                           <div key={idx} className="aspect-square bg-white/[0.05] rounded-2xl overflow-hidden border border-white/10 group cursor-pointer">
                              <img 
                                src={photo} 
                                alt={`Event photo ${idx + 1}`} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                              />
                           </div>
                        ))}
                     </div>
                  ) : (
                    <div className="p-12 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center bg-white/[0.01]">
                       <ImageIcon className="w-10 h-10 text-white/20 mb-4" />
                       <p className="text-white/40 font-bold uppercase tracking-widest text-xs">No photos available yet</p>
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
