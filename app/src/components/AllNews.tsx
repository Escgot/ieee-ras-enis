import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Clock, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Trophy, 
  Sparkles, 
  LayoutGrid, 
  GitCommit, 
  Tag, 
  Images,
  Flame,
  Award
} from 'lucide-react';
import { news, type NewsItem } from '../data/news';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';

const ROBOT_TAGS = ['All Robots', 'Viper', 'Hunter', 'Nemmela', 'Sangour', 'Flash', 'Olivia', 'Phoenix', 'Sofiene'];

export default function AllNews() {
  const navigate = useNavigate();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRobot, setSelectedRobot] = useState('All Robots');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const newsGalleryRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Sync activeImage whenever selectedNews changes
  useEffect(() => {
    if (selectedNews) {
      setActiveImage(selectedNews.image);
    }
  }, [selectedNews]);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedNews) return;

      const photos = selectedNews.photos && selectedNews.photos.length > 0 
        ? selectedNews.photos 
        : [selectedNews.image];
      const currentIdx = photos.indexOf(activeImage || selectedNews.image);

      if (e.key === 'ArrowRight') {
        const nextIdx = (currentIdx + 1) % photos.length;
        setActiveImage(photos[nextIdx]);
      } else if (e.key === 'ArrowLeft') {
        const prevIdx = (currentIdx - 1 + photos.length) % photos.length;
        setActiveImage(photos[prevIdx]);
      } else if (e.key === 'Escape') {
        setSelectedNews(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNews, activeImage]);

  // Filtered news items
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.date.toLowerCase().includes(q);

      const matchesRobot = selectedRobot === 'All Robots' ||
        item.title.toLowerCase().includes(selectedRobot.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(selectedRobot.toLowerCase());

      return matchesSearch && matchesRobot;
    });
  }, [searchQuery, selectedRobot]);

  // Featured post: The latest item (first entry in list) when no search or filter active
  const featuredNews = useMemo(() => {
    if (searchQuery || selectedRobot !== 'All Robots') return null;
    return filteredNews.find((item) => item.isFeatured) || filteredNews[0] || null;
  }, [searchQuery, selectedRobot, filteredNews]);

  // Remaining list (excluding featured item if featured view is shown)
  const remainingNews = useMemo(() => {
    if (!featuredNews) return filteredNews;
    return filteredNews.filter((item) => item.id !== featuredNews.id);
  }, [filteredNews, featuredNews]);

  // Modal Next/Prev Log Navigation
  const navigateLog = (direction: 'next' | 'prev') => {
    if (!selectedNews) return;
    const currentIdx = news.findIndex((item) => item.id === selectedNews.id);
    if (currentIdx === -1) return;

    if (direction === 'next') {
      const nextIdx = (currentIdx + 1) % news.length;
      setSelectedNews(news[nextIdx]);
    } else {
      const prevIdx = (currentIdx - 1 + news.length) % news.length;
      setSelectedNews(news[prevIdx]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-0 pb-32 sm:pb-24 relative transition-colors duration-300">
      
      {/* ═══════════════════ AMBIENT ATMOSPHERE ═══════════════════ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-600/[0.04] dark:bg-red-600/[0.07] blur-[160px] rounded-full" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-rose-600/[0.03] dark:bg-rose-600/[0.06] blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-amber-600/[0.03] dark:bg-amber-600/[0.05] blur-[180px] rounded-full" />
        <div className="absolute inset-0 cyber-grid opacity-[0.04] dark:opacity-[0.03]" />
      </div>

      {/* ═══════════════════ STICKY COMMAND BAR HEADER ═══════════════════ */}
      <header className="sticky top-0 z-40 w-full bg-background/85 dark:bg-[#07070a]/85 backdrop-blur-2xl border-b border-foreground/[0.06] dark:border-white/[0.08] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            
            {/* Left: Back Button & Title */}
            <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
              <button 
                onClick={() => navigate('/#news')}
                aria-label="Back to main page news section"
                className="group flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-foreground/[0.04] dark:bg-white/[0.05] border border-foreground/10 dark:border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-foreground transition-all duration-200 active:scale-95 shrink-0"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.2em] text-red-500 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span>INTELLIGENCE ARCHIVES</span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-muted-foreground">{news.length} DISPATCHES</span>
                </div>
                <h1 className="font-syne text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground truncate">
                  Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500">Logs</span>
                </h1>
              </div>
            </div>

            {/* Right: Search Input & View Switcher */}
            <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto">
              {/* Live Search Input */}
              <div className="relative flex-1 md:w-72 lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search arena, robot, or keyword..."
                  className="w-full pl-9 pr-8 py-2 sm:py-2.5 rounded-xl bg-foreground/[0.03] dark:bg-white/[0.04] border border-foreground/10 dark:border-white/10 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-md transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* View Switcher: Grid vs Timeline */}
              <div className="flex items-center p-1 rounded-xl bg-foreground/[0.03] dark:bg-white/[0.04] border border-foreground/10 dark:border-white/10 shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid layout view"
                  className={`p-1.5 sm:p-2 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  aria-label="Timeline layout view"
                  className={`p-1.5 sm:p-2 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'timeline'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <GitCommit className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Robot Filter Bar (Horizontally scrollable) */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-3 pt-2.5 border-t border-foreground/[0.04] dark:border-white/[0.04] overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground shrink-0 mr-1 flex items-center gap-1">
              <Tag className="w-3 h-3 text-red-500" />
              Units:
            </span>
            {ROBOT_TAGS.map((tag) => {
              const isSelected = selectedRobot === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedRobot(tag)}
                  className={`px-3 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 shrink-0 ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                      : 'bg-foreground/[0.03] dark:bg-white/[0.04] text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06] dark:hover:bg-white/[0.08] border border-foreground/[0.06] dark:border-white/[0.06]'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

        </div>
      </header>

      {/* ═══════════════════ MAIN CONTENT ═══════════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10 relative z-10">

        {/* 1. FEATURED HERO DISPATCH (When viewing full grid without search filters) */}
        {featuredNews && viewMode === 'grid' && (
          <div className="mb-10 sm:mb-14">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Flame className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.2em] text-red-500 uppercase">
                FLAGSHIP DISPATCH // LATEST VICTORY
              </span>
            </div>

            <div 
              onClick={() => setSelectedNews(featuredNews)}
              className="group relative bg-foreground/[0.02] dark:bg-white/[0.02] border border-foreground/10 dark:border-white/10 hover:border-red-500/40 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-[0_20px_60px_rgba(239,68,68,0.12)]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Image Showcase */}
                <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto min-h-[260px] sm:min-h-[340px] lg:min-h-[420px] overflow-hidden bg-black/40">
                  <img
                    src={featuredNews.image}
                    alt={featuredNews.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-background/90" />
                  
                  {/* Badges on Hero Image */}
                  <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-mono text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5" />
                      {featuredNews.category}
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      GOLD CHAMPIONS
                    </span>
                  </div>

                  {featuredNews.photos && featuredNews.photos.length > 1 && (
                    <div className="absolute bottom-4 left-4 z-20 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-white font-mono text-[10px] font-bold flex items-center gap-1.5">
                      <Images className="w-3 h-3 text-red-400" />
                      {featuredNews.photos.length} Photos
                    </div>
                  )}
                </div>

                {/* Content Panel */}
                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    {/* Meta Row */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] text-muted-foreground font-mono font-medium mb-3 sm:mb-4">
                      <div className="flex items-center gap-1.5 text-red-500 font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{featuredNews.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground/70" />
                        <span>{featuredNews.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
                        <span>{featuredNews.readTime}</span>
                      </div>
                    </div>

                    {/* Headline */}
                    <h2 className="font-syne text-xl sm:text-2xl lg:text-3xl font-black uppercase text-foreground group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors leading-tight mb-4">
                      {featuredNews.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans font-medium line-clamp-4 mb-6">
                      {featuredNews.excerpt}
                    </p>
                  </div>

                  {/* CTA Action */}
                  <div className="pt-4 border-t border-foreground/[0.06] dark:border-white/[0.06] flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-500 flex items-center gap-2 group-hover:gap-3 transition-all">
                      Read Full Mission Brief
                      <ArrowRight className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">
                      #INSATDERBY
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MAIN LOGS FEED */}
        <div className="space-y-6">
          
          {/* Section Divider with results count */}
          <div className="flex items-center justify-between pb-3 border-b border-foreground/[0.06] dark:border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-red-500" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                {searchQuery || selectedRobot !== 'All Robots' 
                  ? `Filtered Results (${filteredNews.length})` 
                  : `Historical Archive (${remainingNews.length})`}
              </span>
            </div>
            {(searchQuery || selectedRobot !== 'All Robots') && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedRobot('All Robots'); }}
                className="text-xs font-mono text-red-500 hover:underline uppercase"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Empty State */}
          {filteredNews.length === 0 ? (
            <div className="text-center py-20 px-4 rounded-3xl bg-foreground/[0.02] dark:bg-white/[0.02] border border-dashed border-foreground/10 dark:border-white/10">
              <Search className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4 animate-bounce" />
              <h3 className="font-syne text-xl font-bold uppercase text-foreground mb-2">
                No Mission Logs Found
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                No intelligence records match your search query &quot;{searchQuery}&quot; with unit &quot;{selectedRobot}&quot;.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedRobot('All Robots'); }}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            
            /* ═══════════════════ GRID VIEW ═══════════════════ */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {(featuredNews ? remainingNews : filteredNews).map((item) => (
                <article
                  key={item.id}
                  onClick={() => setSelectedNews(item)}
                  className="group relative bg-foreground/[0.02] dark:bg-white/[0.02] border border-foreground/[0.08] dark:border-white/[0.08] hover:border-red-500/40 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(239,68,68,0.1)] flex flex-col justify-between"
                >
                  {/* Top Image Box */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-black/30">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-80" />
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-md bg-red-600/90 text-white font-mono text-[9px] font-bold uppercase tracking-wider shadow">
                        {item.category}
                      </span>
                    </div>

                    {item.photos && item.photos.length > 1 && (
                      <div className="absolute bottom-3 right-3 z-10 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-white font-mono text-[9px] font-bold flex items-center gap-1">
                        <Images className="w-2.5 h-2.5 text-red-400" />
                        {item.photos.length}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
                    <div>
                      {/* Meta Tags */}
                      <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground mb-2.5">
                        <span className="flex items-center gap-1 text-red-500 font-bold">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 truncate max-w-[130px]">
                          <MapPin className="w-3 h-3 text-muted-foreground/60" />
                          {item.location}
                        </span>
                      </div>

                      {/* Title (Clean readable font, left aligned) */}
                      <h3 className="font-syne text-base sm:text-lg font-bold uppercase text-foreground leading-snug group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors mb-2.5 line-clamp-2">
                        {item.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-xs text-muted-foreground leading-relaxed font-sans line-clamp-3 mb-4">
                        {item.excerpt}
                      </p>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-foreground/[0.05] dark:border-white/[0.05] flex items-center justify-between mt-auto">
                      <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.readTime}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase text-red-500 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                        Read Entry
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (

            /* ═══════════════════ CHRONOLOGICAL TIMELINE VIEW ═══════════════════ */
            <div className="relative pl-6 sm:pl-10 space-y-8 sm:space-y-12 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-red-600 before:via-rose-600 before:to-transparent">
              {filteredNews.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedNews(item)}
                  className="relative group cursor-pointer"
                >
                  {/* Timeline Glowing Node */}
                  <div className="absolute -left-6 sm:-left-10 top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-background border-2 border-red-500 z-10 group-hover:scale-125 transition-transform shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                    <div className="absolute inset-1 rounded-full bg-red-500 group-hover:animate-ping" />
                  </div>

                  {/* Card Container */}
                  <div className="bg-foreground/[0.02] dark:bg-white/[0.02] border border-foreground/[0.08] dark:border-white/[0.08] hover:border-red-500/40 rounded-3xl p-5 sm:p-7 transition-all duration-300 hover:shadow-[0_15px_40px_rgba(239,68,68,0.08)]">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                      
                      {/* Image Thumbnail */}
                      <div className="sm:col-span-4 aspect-[16/10] rounded-2xl overflow-hidden bg-black/40 relative">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          loading="lazy" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[8px] font-bold uppercase">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="sm:col-span-8 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-muted-foreground mb-2">
                            <span className="flex items-center gap-1 text-red-500 font-bold">
                              <Calendar className="w-3 h-3" />
                              {item.date}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-muted-foreground/60" />
                              {item.location}
                            </span>
                            <span>•</span>
                            <span>{item.readTime}</span>
                          </div>

                          <h3 className="font-syne text-lg sm:text-xl font-bold uppercase text-foreground group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors mb-2">
                            {item.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-muted-foreground font-sans line-clamp-2 mb-4 leading-relaxed">
                            {item.excerpt}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-foreground/[0.04] dark:border-white/[0.04]">
                          <span className="text-[10px] font-mono font-bold text-red-500 uppercase flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                            Open Briefing
                            <ArrowRight className="w-3 h-3" />
                          </span>
                          {item.photos && item.photos.length > 1 && (
                            <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                              <Images className="w-3 h-3" />
                              {item.photos.length} Records
                            </span>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </main>

      {/* ═══════════════════ HIGH-FIDELITY MISSION LOG DETAIL MODAL ═══════════════════ */}
      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent 
          showCloseButton={false}
          className="sm:max-w-4xl lg:max-w-6xl w-[95vw] lg:w-[90vw] h-[92vh] sm:h-[86vh] lg:h-[80vh] lg:max-h-[720px] bg-background/98 dark:bg-[#09090d]/98 border border-foreground/10 dark:border-white/10 backdrop-blur-3xl p-0 overflow-hidden rounded-3xl outline-none shadow-2xl flex flex-col my-auto"
        >
          {selectedNews && (
            <div className="relative w-full h-full flex flex-col lg:flex-row overflow-hidden">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedNews(null)}
                aria-label="Close dialog"
                className="absolute top-4 right-4 z-50 p-2 text-foreground bg-black/50 hover:bg-red-600 text-white rounded-full border border-white/20 transition-all active:scale-95 backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>

              {/* ── LEFT COLUMN: PHOTO SHOWCASE & THUMBNAILS (Desktop 58% / Mobile 100%) ── */}
              <div className="w-full lg:w-[58%] h-[300px] xs:h-[360px] sm:h-[420px] lg:h-full relative flex flex-col shrink-0 bg-black/70 overflow-hidden border-b lg:border-b-0 lg:border-r border-foreground/[0.08] dark:border-white/[0.08]">
                
                {/* Main Active Image with Smooth Crossfade */}
                <div className="flex-1 relative flex items-center justify-center overflow-hidden group/media p-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImage || selectedNews.image}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.25 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <img
                        src={activeImage || selectedNews.image}
                        alt={selectedNews.title}
                        className="w-full h-full object-contain select-none"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Left / Right Carousel Arrow Buttons */}
                  {selectedNews.photos && selectedNews.photos.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const photos = selectedNews.photos!;
                          const currentIdx = photos.indexOf(activeImage || selectedNews.image);
                          const prevIdx = (currentIdx - 1 + photos.length) % photos.length;
                          setActiveImage(photos[prevIdx]);
                        }}
                        aria-label="Previous photo"
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/20 transition-all opacity-80 hover:opacity-100 backdrop-blur-md active:scale-90"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const photos = selectedNews.photos!;
                          const currentIdx = photos.indexOf(activeImage || selectedNews.image);
                          const nextIdx = (currentIdx + 1) % photos.length;
                          setActiveImage(photos[nextIdx]);
                        }}
                        aria-label="Next photo"
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/20 transition-all opacity-80 hover:opacity-100 backdrop-blur-md active:scale-90"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </>
                  )}

                  {/* Floating Category Badge */}
                  <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-mono text-[10px] font-bold uppercase tracking-widest shadow-lg">
                      {selectedNews.category}
                    </span>
                  </div>
                </div>

                {/* Thumbnails Bar (Clickable) */}
                {selectedNews.photos && selectedNews.photos.length > 1 && (
                  <div className="px-4 py-2.5 bg-black/80 border-t border-white/10 shrink-0 relative">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5" ref={newsGalleryRef}>
                      {selectedNews.photos.map((photo, idx) => {
                        const isCurrent = (activeImage || selectedNews.image) === photo;
                        return (
                          <button
                            key={idx}
                            onClick={() => setActiveImage(photo)}
                            className={`w-14 h-10 sm:w-16 sm:h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all relative ${
                              isCurrent 
                                ? 'border-red-500 scale-105 shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                                : 'border-white/10 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={photo} alt="" className="w-full h-full object-cover" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

              {/* ── RIGHT COLUMN: MISSION NARRATIVE & METRICS (Desktop 42% / Mobile 100%) ── */}
              <div className="w-full lg:w-[42%] flex-1 flex flex-col justify-between p-6 sm:p-8 lg:p-9 overflow-y-auto no-scrollbar bg-background dark:bg-[#09090d]">
                
                <div className="space-y-5">
                  {/* Meta Tags */}
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground mb-2">
                      <span className="flex items-center gap-1.5 text-red-500 font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        {selectedNews.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        {selectedNews.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        {selectedNews.readTime}
                      </span>
                    </div>

                    <DialogTitle className="font-syne text-xl sm:text-2xl font-black uppercase text-foreground leading-tight">
                      {selectedNews.title}
                    </DialogTitle>
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-foreground/[0.06] dark:border-white/[0.08]" />

                  {/* Body Paragraphs */}
                  <div className="space-y-3.5 text-muted-foreground text-xs sm:text-sm leading-relaxed font-sans font-medium">
                    <p className="text-foreground text-sm sm:text-base font-semibold leading-relaxed">
                      {selectedNews.excerpt}
                    </p>
                    <p>
                      This mission stands as a testament to the rigorous testing, algorithmic precision, and mechanical integrity cultivated within the IEEE Robotics & Automation Society ENIS Student Branch.
                    </p>
                    <p>
                      Through relentless iteration in motor calibration, sensory fusion, and real-time path planning, our engineers continuously raise the standard in national and international arenas.
                    </p>
                  </div>

                  {/* Tactical Specs Callout */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-foreground/[0.02] dark:bg-white/[0.02] border border-foreground/[0.06] dark:border-white/[0.06]">
                    <div>
                      <span className="block text-[8px] sm:text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Location</span>
                      <span className="font-syne text-[11px] sm:text-xs font-bold text-foreground truncate block">{selectedNews.location}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] sm:text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Division</span>
                      <span className="font-syne text-[11px] sm:text-xs font-bold text-red-500 truncate block">{selectedNews.category}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="block text-[8px] sm:text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Status</span>
                      <span className="font-syne text-[11px] sm:text-xs font-bold text-emerald-500">Verified Log</span>
                    </div>
                  </div>
                </div>

                {/* Mission Pager Footer */}
                <div className="pt-5 mt-6 border-t border-foreground/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                  <button
                    onClick={() => navigateLog('prev')}
                    className="group flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Previous
                  </button>
                  <button
                    onClick={() => navigateLog('next')}
                    className="group flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
