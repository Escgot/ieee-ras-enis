import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Calendar, MapPin, Users, Filter, ChevronRight, ArrowLeft, X, Image as ImageIcon } from 'lucide-react';
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
          <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="event-card group relative bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 rounded-2xl overflow-hidden hover:border-red-500/30 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background dark:from-dark-100 to-transparent" />

                  {/* Status Badge */}
                  <div
                    className={`absolute top-4 left-4 px-3 py-1 text-xs font-medium rounded-full ${
                      event.status === 'upcoming'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}
                  >
                    {event.status === 'upcoming' ? 'Upcoming' : 'Past'}
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 rounded-full">
                    {event.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-orbitron text-lg font-bold text-foreground mb-2 group-hover:text-red-500 transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 text-red-500" />
                      <span>{event.date}</span>
                      <span className="text-gray-600">•</span>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4 text-red-500" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all ${
                      event.status === 'upcoming'
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-white/5 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={event.status !== 'upcoming'}
                  >
                    {event.status === 'upcoming' ? (
                      <>
                        RSVP Now
                        <ChevronRight className="w-4 h-4" />
                      </>
                    ) : (
                      'Event Ended'
                    )}
                  </button>
                </div>
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
