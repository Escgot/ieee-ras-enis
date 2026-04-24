import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Calendar, ArrowLeft, X, ChevronLeft, ChevronRight, Images, MapPin } from 'lucide-react';
import { galleryEvents, type GalleryEvent } from '../data/gallery';

gsap.registerPlugin(ScrollTrigger);

/* ── Extract unique years and define months ── */
const allYears = Array.from(new Set(galleryEvents.map(e => e.date.match(/\d{4}/)?.[0]).filter(Boolean))) as string[];
allYears.sort((a, b) => b.localeCompare(a));

const months = [
  { value: 'January', label: '01 - January' },
  { value: 'February', label: '02 - February' },
  { value: 'March', label: '03 - March' },
  { value: 'April', label: '04 - April' },
  { value: 'May', label: '05 - May' },
  { value: 'June', label: '06 - June' },
  { value: 'July', label: '07 - July' },
  { value: 'August', label: '08 - August' },
  { value: 'September', label: '09 - September' },
  { value: 'October', label: '10 - October' },
  { value: 'November', label: '11 - November' },
  { value: 'December', label: '12 - December' },
];

export default function AllGallery({ onBack }: { onBack?: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMonth, setActiveMonth] = useState('All');
  const [activeYear, setActiveYear] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState<GalleryEvent | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<{ src: string; eventName: string; idx: number; total: number } | null>(null);
  const [viewMode, setViewMode] = useState<'events' | 'all'>('events');
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  /* ── Filtering ── */
  const filteredEvents = useMemo(() => {
    return galleryEvents.filter((event) => {
      const eventYear = event.date.match(/\d{4}/)?.[0];
      const matchesMonth = activeMonth === 'All' || event.date.includes(activeMonth);
      const matchesYear = activeYear === 'All' || eventYear === activeYear;

      const matchesSearch =
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.date.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesMonth && matchesYear && matchesSearch;
    });
  }, [searchQuery, activeMonth, activeYear]);

  /* ── All photos flat view ── */
  const allPhotosFlat = useMemo(() => {
    return filteredEvents.flatMap(event =>
      event.photos.map(photo => ({ src: photo, eventName: event.name, eventId: event.id }))
    );
  }, [filteredEvents]);

  /* ── Horizontal Masonry Distribution ── */
  const [colCount, setColCount] = useState(4);
  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth >= 1024) setColCount(4);
      else if (window.innerWidth >= 768) setColCount(3);
      else setColCount(2);
    };
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  const photoColumns = useMemo(() => {
    const cols: typeof allPhotosFlat[] = Array.from({ length: colCount }, () => []);
    allPhotosFlat.forEach((photo, i) => {
      cols[i % colCount].push(photo);
    });
    return cols;
  }, [allPhotosFlat, colCount]);

  const selectedEventColumns = useMemo(() => {
    if (!selectedEvent) return [];
    const cols: string[][] = Array.from({ length: colCount }, () => []);
    selectedEvent.photos.forEach((photo, i) => {
      cols[i % colCount].push(photo);
    });
    return cols;
  }, [selectedEvent, colCount]);

  /* ── GSAP Animations (event cards only) ── */
  useEffect(() => {
    if (viewMode !== 'events') return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gallery-card',
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredEvents, viewMode]);

  /* ── Lightbox keyboard navigation ── */
  const navigateLightbox = useCallback((direction: 'prev' | 'next') => {
    if (!lightboxPhoto || !selectedEvent) return;
    const photos = selectedEvent.photos;
    const currentIdx = photos.indexOf(lightboxPhoto.src);
    let newIdx: number;
    if (direction === 'next') {
      newIdx = (currentIdx + 1) % photos.length;
    } else {
      newIdx = (currentIdx - 1 + photos.length) % photos.length;
    }
    setLightboxPhoto({
      src: photos[newIdx],
      eventName: selectedEvent.name,
      idx: newIdx,
      total: photos.length,
    });
  }, [lightboxPhoto, selectedEvent]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxPhoto) return;
      if (e.key === 'ArrowRight') navigateLightbox('next');
      else if (e.key === 'ArrowLeft') navigateLightbox('prev');
      else if (e.key === 'Escape') setLightboxPhoto(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxPhoto, navigateLightbox]);

  const openLightbox = (photo: string, event: GalleryEvent) => {
    const idx = event.photos.indexOf(photo);
    setSelectedEvent(event);
    setLightboxPhoto({
      src: photo,
      eventName: event.name,
      idx,
      total: event.photos.length,
    });
  };

  /* ── Total photo count ── */
  const totalPhotos = filteredEvents.reduce((sum, e) => sum + e.photos.length, 0);

  return (
    <section id="gallery" ref={sectionRef} className="relative pt-0 pb-20 bg-transparent min-h-screen">
      {/* Search & Filter Header (Sticky) */}
      <div className="relative border-b border-black/5 dark:border-white/5 bg-transparent sticky top-0 z-40 backdrop-blur-2xl pt-4">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              {onBack && (
                <button 
                  onClick={onBack}
                  className="p-3 bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 rounded-full hover:bg-red-500 hover:text-white transition-all group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </button>
              )}
              <div>
                <h1 className="font-orbitron text-2xl font-bold text-foreground uppercase tracking-tight">Visual <span className="text-red-500">Gallery</span></h1>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 rounded-lg">
                    <Images className="w-3 h-3 text-red-500" />
                    <span className="text-[10px] font-bold text-foreground">{totalPhotos} <span className="text-muted-foreground font-medium uppercase tracking-widest ml-0.5">Photos</span></span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 rounded-lg">
                    <Calendar className="w-3 h-3 text-purple-500" />
                    <span className="text-[10px] font-bold text-foreground">{filteredEvents.length} <span className="text-muted-foreground font-medium uppercase tracking-widest ml-0.5">Events</span></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Find events or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 rounded-2xl text-foreground dark:text-white placeholder-muted-foreground focus:outline-none focus:border-red-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4 pb-4">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar lg:flex-wrap">
              <div className="flex items-center gap-2">
                <select
                  value={activeMonth}
                  onChange={(e) => setActiveMonth(e.target.value)}
                  className="appearance-none pl-4 pr-8 py-2.5 bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 rounded-xl text-foreground dark:text-white text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-red-500/50 hover:border-red-500/50 transition-colors cursor-pointer"
                >
                  <option value="All" className="bg-white dark:bg-[#0c0c0e]">Month</option>
                  {months.map((m) => (
                    <option key={m.value} value={m.value} className="bg-white dark:bg-[#0c0c0e]">{m.label}</option>
                  ))}
                </select>
                <select
                  value={activeYear}
                  onChange={(e) => setActiveYear(e.target.value)}
                  className="appearance-none pl-4 pr-8 py-2.5 bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 rounded-xl text-foreground dark:text-white text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-red-500/50 hover:border-red-500/50 transition-colors cursor-pointer"
                >
                  <option value="All" className="bg-white dark:bg-[#0c0c0e]">Year</option>
                  {allYears.map((year) => (
                    <option key={year} value={year} className="bg-white dark:bg-[#0c0c0e]">{year}</option>
                  ))}
                </select>
              </div>

              <div className="h-6 w-px bg-white/5 hidden sm:block" />

              <div className="flex items-center gap-1 p-1 bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 rounded-xl">
                <button
                  onClick={() => setViewMode('events')}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'events' ? 'bg-red-500 text-white' : 'text-muted-foreground'}`}
                >
                  Events
                </button>
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'all' ? 'bg-red-500 text-white' : 'text-muted-foreground'}`}
                >
                  All Photos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 mt-8">
        <div className="max-w-7xl mx-auto">



          {/* ═══════════ EVENT CARDS VIEW ═══════════ */}
          {viewMode === 'events' && (
            <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="gallery-card group relative bg-foreground/[0.02] dark:bg-[#0a0a0b]/40 border border-foreground/5 dark:border-white/5 rounded-[2rem] overflow-hidden hover:border-red-500/20 transition-all duration-700 cursor-pointer shadow-xl hover:shadow-red-500/5"
                  onClick={() => {
                    setSelectedEvent(event);
                  }}
                >
                  {/* Cover Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={event.cover}
                      alt={event.name}
                      className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1 opacity-60 group-hover:opacity-100 group-hover:brightness-75"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

                    {/* Photo Count Badge */}
                    <div className="absolute top-5 right-5 z-20">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black text-white/90 bg-black/40 backdrop-blur-md border border-white/10 rounded-full uppercase tracking-widest shadow-lg">
                        <Images className="w-3 h-3" />
                        {event.photos.length}
                      </span>
                    </div>

                    {/* Date Badge */}
                    <div className="absolute top-5 left-5 z-20">
                      <span className="px-3 py-1 text-[9px] font-black text-red-400 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-full uppercase tracking-widest shadow-lg">
                        {event.date}
                      </span>
                    </div>

                    {/* Hover overlay with preview grid */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="flex items-center gap-2 px-5 py-3 bg-black/50 backdrop-blur-md rounded-2xl border border-white/10">
                        <Images className="w-4 h-4 text-white" />
                        <span className="text-white text-xs font-bold uppercase tracking-wider">View Album</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 relative z-20">
                    <h3 className="font-orbitron text-lg font-black text-foreground mb-2 group-hover:text-red-400 transition-colors uppercase leading-tight tracking-tight">
                      {event.name}
                    </h3>

                    <div className="flex flex-wrap gap-3 mt-3">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5 text-red-500/60" />
                        <span>{event.date}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                          <MapPin className="w-3.5 h-3.5 text-purple-500/60" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Border Glow */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-500/0 via-red-500/40 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                </div>
              ))}
            </div>
          )}

          {/* ═══════════ ALL PHOTOS HORIZONTAL MASONRY ═══════════ */}
          {viewMode === 'all' && (
            <div ref={cardsRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 animate-[gallery-fade-in_0.6s_ease-out] items-start">
              {photoColumns.map((col, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-3 sm:gap-4">
                  {col.map((photo, i) => (
                    <div
                      key={`${photo.eventId}-${i}`}
                      className="group relative rounded-2xl overflow-hidden cursor-pointer border border-foreground/5 dark:border-white/5 hover:border-red-500/20 transition-all duration-500"
                      onClick={() => {
                        const event = galleryEvents.find(e => e.id === photo.eventId)!;
                        openLightbox(photo.src, event);
                      }}
                    >
                      <img
                        src={photo.src}
                        alt={photo.eventName}
                        className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <p className="text-white text-[10px] font-bold uppercase tracking-wider truncate">
                          {photo.eventName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-foreground/5 dark:bg-white/5 rounded-full border border-foreground/10 dark:border-white/10">
                <Search className="w-9 h-9 text-gray-500" />
              </div>
              <h3 className="font-orbitron text-xl font-semibold text-foreground mb-2">
                No events found
              </h3>
              <p className="text-muted-foreground">Try adjusting your search or date filter</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveMonth('All');
                  setActiveYear('All');
                }}
                className="mt-4 px-5 py-2.5 text-sm font-bold text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════ EVENT DETAIL OVERLAY ═══════════ */}
      {selectedEvent && !lightboxPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedEvent(null)}
          />

          {/* Content */}
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-white/95 dark:bg-[#0c0c0e]/95 border border-foreground/10 dark:border-white/10 backdrop-blur-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-[scale-in_0.3s_ease-out]">
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-foreground/5 dark:border-white/5 shrink-0">
              <div>
                <h3 className="font-orbitron text-lg sm:text-xl font-black text-foreground uppercase tracking-tight">
                  {selectedEvent.name}
                </h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    <Calendar className="w-3 h-3 text-red-500" />
                    {selectedEvent.date}
                  </span>
                  {selectedEvent.location && (
                    <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      <MapPin className="w-3 h-3 text-purple-500" />
                      {selectedEvent.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    <Images className="w-3 h-3 text-red-500" />
                    {selectedEvent.photos.length} photos
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-2.5 text-muted-foreground hover:text-foreground bg-foreground/5 dark:bg-white/5 hover:bg-foreground/10 dark:hover:bg-white/10 border border-foreground/10 dark:border-white/10 rounded-xl transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-start">
                {selectedEventColumns.map((col, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-3">
                    {col.map((photo) => {
                      const idx = selectedEvent.photos.indexOf(photo);
                      return (
                        <div
                          key={idx}
                          className="group relative rounded-xl overflow-hidden cursor-pointer border border-foreground/5 dark:border-white/5 hover:border-red-500/30 transition-all duration-500 hover:shadow-lg hover:shadow-red-500/10"
                          onClick={() => openLightbox(photo, selectedEvent)}
                        >
                          <img
                            src={photo}
                            alt={`${selectedEvent.name} - Photo ${idx + 1}`}
                            className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-90"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="px-2 py-1 text-[8px] font-black text-white bg-black/40 backdrop-blur-md rounded-lg uppercase tracking-wider">
                              {idx + 1}/{selectedEvent.photos.length}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ LIGHTBOX ═══════════ */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-xl">
          {/* Close */}
          <button
            onClick={() => setLightboxPhoto(null)}
            className="absolute top-5 right-5 z-50 p-3 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Info */}
          <div className="absolute top-5 left-5 z-50">
            <p className="text-white/80 text-xs font-bold uppercase tracking-wider">{lightboxPhoto.eventName}</p>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">
              {lightboxPhoto.idx + 1} / {lightboxPhoto.total}
            </p>
          </div>

          {/* Prev */}
          <button
            onClick={() => navigateLightbox('prev')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 backdrop-blur-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next */}
          <button
            onClick={() => navigateLightbox('next')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 backdrop-blur-md"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image */}
          <div className="w-full h-full flex items-center justify-center p-2 sm:p-8">
            <img
              src={lightboxPhoto.src}
              alt={lightboxPhoto.eventName}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-[scale-in_0.2s_ease-out]"
            />
          </div>

          {/* Bottom thumbnail strip */}
          {selectedEvent && selectedEvent.photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 px-4 py-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/5 max-w-[90vw] overflow-x-auto no-scrollbar">
              {selectedEvent.photos.map((photo, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    setLightboxPhoto({
                      src: photo,
                      eventName: selectedEvent.name,
                      idx,
                      total: selectedEvent.photos.length,
                    })
                  }
                  className={`w-12 h-9 shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${lightboxPhoto.src === photo
                    ? 'border-red-500 ring-2 ring-red-500/30 opacity-100'
                    : 'border-transparent opacity-40 hover:opacity-80'
                    }`}
                >
                  <img src={photo} className="w-full h-full object-cover" alt="" loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
