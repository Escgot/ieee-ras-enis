import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Calendar, MapPin, Users, Filter, ChevronRight, ArrowLeft } from 'lucide-react';
import { events } from '../data/events';

gsap.registerPlugin(ScrollTrigger);

const categories = ['All Events', 'Workshops', 'Competitions', 'Social'];

export default function AllEvents({ onBack }: { onBack?: () => void }) {
  const [activeCategory, setActiveCategory] = useState('All Events');
  const [searchQuery, setSearchQuery] = useState('');
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
                className="absolute left-0 top-0 p-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            )}
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-red-500 bg-red-500/10 border border-red-500/20 rounded-full">
              Full Archive
            </span>
            <h2 className="font-orbitron text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              All <span className="text-gradient">Events</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
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
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
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
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
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
                className="event-card group relative bg-dark-100 border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/30 transition-all duration-300"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-100 to-transparent" />

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
                  <h3 className="font-orbitron text-lg font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{event.description}</p>

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
              <h3 className="font-orbitron text-xl font-semibold text-white mb-2">
                No events found
              </h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Stats Removed */}
        </div>
      </div>
    </section>
  );
}
