import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  X,
  Plus,
  Minus,
  Check,
  Star,
  ShieldCheck,
  SlidersHorizontal,
  Eye,
  Copy,
  PackageCheck,
  RotateCcw,
} from 'lucide-react';
import { shopItems, type ShopItem } from '../data/shop';
import Footer from './Footer';

interface CartItem {
  item: ShopItem;
  size?: string;
  quantity: number;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name';
type PriceFilter = 'all' | 'under10' | '10to35' | 'above35';

export default function AllProducts() {
  const navigate = useNavigate();

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');

  // Modal & Cart states
  const [selectedProduct, setSelectedProduct] = useState<ShopItem | null>(null);
  const [modalSize, setModalSize] = useState<string>('');
  const [modalQty, setModalQty] = useState<number>(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedOrder, setCopiedOrder] = useState(false);

  // Categories list
  const categories = useMemo(() => {
    return ['All', 'Merch', 'key chain', 'Electronics'];
  }, []);

  // Category labels for clean display
  const categoryLabels: Record<string, string> = {
    All: 'All Gear',
    Merch: 'Apparel & Merch',
    'key chain': 'Keychains & Accs',
    Electronics: 'Hardware & Kits',
  };

  // Toast handler
  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Set default size when opening a product modal
  useEffect(() => {
    if (selectedProduct) {
      setModalSize(selectedProduct.sizes?.[0] || '');
      setModalQty(1);
    }
  }, [selectedProduct]);

  // Handle ESC key for modal and cart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedProduct) setSelectedProduct(null);
        else if (isCartOpen) setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProduct, isCartOpen]);

  // Cart operations
  const addToCart = (item: ShopItem, size?: string, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (ci) => ci.item.id === item.id && ci.size === size
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { item, size, quantity }];
    });
    triggerToast(`Added ${item.name}${size ? ` (${size})` : ''} to bag!`);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const next = [...prev];
      const newQty = next[index].quantity + delta;
      if (newQty <= 0) {
        next.splice(index, 1);
      } else {
        next[index].quantity = newQty;
      }
      return next;
    });
  };

  const totalCartCount = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [cart]);

  const totalCartPrice = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.item.priceNum * curr.quantity, 0);
  }, [cart]);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return shopItems
      .filter((item) => {
        // Search
        const q = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !q ||
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.badge && item.badge.toLowerCase().includes(q));

        // Category
        const matchesCategory =
          activeCategory === 'All' ||
          item.category.toLowerCase() === activeCategory.toLowerCase();

        // Price
        let matchesPrice = true;
        if (priceFilter === 'under10') matchesPrice = item.priceNum < 10;
        else if (priceFilter === '10to35') matchesPrice = item.priceNum >= 10 && item.priceNum <= 35;
        else if (priceFilter === 'above35') matchesPrice = item.priceNum > 35;

        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceNum - b.priceNum;
        if (sortBy === 'price-desc') return b.priceNum - a.priceNum;
        if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return a.id - b.id; // default featured
      });
  }, [searchTerm, activeCategory, priceFilter, sortBy]);

  // Copy order summary for Discord/WhatsApp
  const copyOrderSummary = () => {
    if (cart.length === 0) return;
    const lines = [
      '🛒 **IEEE RAS ENIS Shop Order Summary**',
      '────────────────────────────',
      ...cart.map(
        (ci, i) =>
          `${i + 1}. ${ci.item.name}${ci.size ? ` (Size: ${ci.size})` : ''} x${ci.quantity} - ${(
            ci.item.priceNum * ci.quantity
          ).toFixed(2)} TND`
      ),
      '────────────────────────────',
      `**Total Amount: ${totalCartPrice.toFixed(2)} TND**`,
      '📍 Pickup Location: ENIS Sfax RAS Lab / Desk',
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedOrder(true);
    triggerToast('Order summary copied to clipboard!');
    setTimeout(() => setCopiedOrder(false), 3000);
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground pb-24 selection:bg-red-500/20 selection:text-red-500">
      {/* ============================================================ */}
      {/* 1. TOP NAV & STATUS BAR                                      */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 border-b border-foreground/5 dark:border-white/5 bg-background/80 dark:bg-[#060608]/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Back & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/#shop')}
              className="w-9 h-9 rounded-lg flex items-center justify-center bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 hover:border-red-500/40 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors group"
              title="Return to Chapter Homepage"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-muted-foreground/60">DEPOT</span>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-red-500 font-bold uppercase tracking-wider">
                Store Catalog
              </span>
            </div>
          </div>

          {/* Center: Live chapter status telemetry (Desktop) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/[0.03] dark:bg-white/[0.03] border border-foreground/5 dark:border-white/5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Campus Desk Sfax</span>
            <span className="text-foreground/20 dark:text-white/20">•</span>
            <span className="text-emerald-500 font-bold">In-Stock Ready</span>
          </div>

          {/* Right: Cart Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/15 border border-red-500/30 text-red-500 font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              {totalCartCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-600 text-white text-[10px] font-mono font-black animate-in zoom-in-75">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section className="relative pt-10 sm:pt-14 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-mono uppercase tracking-[0.2em] font-bold mb-4">
              <Sparkles className="w-3 h-3 text-red-500" />
              Official Chapter Gear & Hardware
            </div>
            <h1 className="font-orbitron text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground leading-[1.08]">
              Gear <span className="text-gradient">Depot</span>
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground text-sm sm:text-base leading-relaxed">
              Official IEEE RAS ENIS chapter apparel, hardware development kits, prototyping
              components, and limited-run accessories. 100% of proceeds fund student robotics
              competitions and hardware labs.
            </p>
          </div>

          {/* Quick value badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full lg:w-auto">
            <div className="p-3 rounded-xl bg-foreground/[0.02] dark:bg-white/[0.02] border border-foreground/5 dark:border-white/5">
              <div className="text-lg font-orbitron font-bold text-foreground">8+</div>
              <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
                Catalog Items
              </div>
            </div>
            <div className="p-3 rounded-xl bg-foreground/[0.02] dark:bg-white/[0.02] border border-foreground/5 dark:border-white/5">
              <div className="text-lg font-orbitron font-bold text-emerald-500">100%</div>
              <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
                Student Non-Profit
              </div>
            </div>
            <div className="p-3 rounded-xl bg-foreground/[0.02] dark:bg-white/[0.02] border border-foreground/5 dark:border-white/5">
              <div className="text-lg font-orbitron font-bold text-red-500">ENIS</div>
              <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
                Campus Handoff
              </div>
            </div>
            <div className="p-3 rounded-xl bg-foreground/[0.02] dark:bg-white/[0.02] border border-foreground/5 dark:border-white/5">
              <div className="text-lg font-orbitron font-bold text-amber-500 flex items-center gap-1">
                4.9 <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              </div>
              <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
                Chapter Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. FILTER, SEARCH & CONTROLS TOOLBAR                         */}
      {/* ============================================================ */}
      <section className="sticky top-16 z-30 bg-background/95 dark:bg-[#060608]/95 backdrop-blur-md border-y border-foreground/5 dark:border-white/5 py-3.5 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-3">
          {/* Row 1: Search + Category Pills */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap flex-shrink-0 ${
                      isActive
                        ? 'text-white'
                        : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeProductPill"
                        className="absolute inset-0 bg-red-600 rounded-lg shadow-[0_2px_12px_rgba(239,68,68,0.35)]"
                        transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
                      />
                    )}
                    <span className="relative z-10">{categoryLabels[cat] || cat}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80 flex-shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <input
                type="text"
                placeholder="Search gear, hardware, kits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-9 py-2 rounded-lg bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 text-xs font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:border-red-500/50 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Secondary Filters (Sort + Price Range + Results Count) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-foreground/5 dark:border-white/5 text-xs text-muted-foreground">
            {/* Left: Price quick filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-mono text-muted-foreground/60 mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" /> Price:
              </span>
              {[
                { id: 'all', label: 'All' },
                { id: 'under10', label: '< 10 TND' },
                { id: '10to35', label: '10 - 35 TND' },
                { id: 'above35', label: '> 35 TND' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPriceFilter(p.id as PriceFilter)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                    priceFilter === p.id
                      ? 'bg-foreground/10 dark:bg-white/10 text-foreground font-bold border border-foreground/20 dark:border-white/20'
                      : 'hover:text-foreground'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Right: Sort & Count */}
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-[11px] font-mono">
                Showing{' '}
                <strong className="text-foreground">{filteredProducts.length}</strong> of{' '}
                {shopItems.length}
              </span>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-muted-foreground/60">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 text-foreground text-xs rounded-md px-2 py-1 focus:outline-none focus:border-red-500/50 font-mono"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. PRODUCT GRID                                              */}
      {/* ============================================================ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProducts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.04, ease: [0.25, 0.4, 0.25, 1] }}
                  data-cursor-text="VIEW"
                  onClick={() => setSelectedProduct(item)}
                  className="group relative flex flex-col bg-foreground/[0.02] dark:bg-white/[0.02] border border-foreground/5 dark:border-white/5 rounded-xl overflow-hidden hover:border-red-500/30 hover:shadow-[0_8px_30px_rgba(239,68,68,0.08)] transition-all duration-300 cursor-pointer"
                >
                  {/* Top Image Showcase */}
                  <div className="relative aspect-[4/3.5] overflow-hidden bg-foreground/[0.03] dark:bg-white/[0.03]">
                    {/* Badge (Bestseller, Limited, etc.) */}
                    {item.badge && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider bg-red-600/90 text-white backdrop-blur-md shadow-md">
                          {item.badge}
                        </span>
                      </div>
                    )}

                    {/* Stock Status Pill */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        In Stock
                      </span>
                    </div>

                    {/* Image with subtle hover zoom */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 opacity-85 group-hover:opacity-100"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />

                    {/* Quick View Button on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-white text-black text-xs font-bold font-mono tracking-wider shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Eye className="w-3.5 h-3.5 text-red-600" /> Quick View
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] font-mono text-muted-foreground">
                      <span className="uppercase tracking-widest text-red-500 font-bold">
                        {categoryLabels[item.category] || item.category}
                      </span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {item.rating || 4.9}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-orbitron text-sm font-bold text-foreground group-hover:text-red-500 transition-colors uppercase line-clamp-1 mb-2">
                      {item.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-1">
                      {item.description}
                    </p>

                    {/* Sizes preview if applicable */}
                    {item.sizes && (
                      <div className="flex items-center gap-1 mb-3">
                        <span className="text-[10px] font-mono text-muted-foreground/60 mr-1">
                          Sizes:
                        </span>
                        {item.sizes.map((sz) => (
                          <span
                            key={sz}
                            className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-foreground/5 dark:bg-white/5 border border-foreground/5 dark:border-white/5 text-muted-foreground"
                          >
                            {sz}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Price & Action Footer */}
                    <div className="pt-3 border-t border-foreground/5 dark:border-white/5 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[9px] font-mono uppercase text-muted-foreground/60">
                          Price
                        </div>
                        <div className="font-orbitron text-base font-black text-foreground">
                          {item.price}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item, item.sizes?.[0]);
                        }}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/30 text-red-500 font-mono text-xs font-bold transition-all active:scale-95"
                        title="Add to order bag"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty Search State */
          <div className="py-24 text-center border border-dashed border-foreground/10 dark:border-white/10 rounded-xl p-8 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-orbitron text-lg font-bold text-foreground uppercase tracking-tight">
              No Matching Products Found
            </h3>
            <p className="text-muted-foreground text-xs mt-2 max-w-sm mx-auto">
              We couldn't find any products matching "{searchTerm}". Try clearing your search or
              selecting another category.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('All');
                setPriceFilter('all');
              }}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 text-xs font-mono font-bold hover:bg-red-500 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* 5. PRODUCT DETAIL & QUICK-VIEW MODAL                         */}
      {/* ============================================================ */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
              className="t-resize relative w-full max-w-3xl bg-background dark:bg-[#0c0c10] border border-foreground/10 dark:border-white/10 rounded-xl overflow-hidden shadow-2xl z-10 my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-lg flex items-center justify-center bg-black/60 text-white hover:bg-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left: Image Showcase */}
                <div className="relative aspect-square md:aspect-auto bg-foreground/5 dark:bg-white/5 overflow-hidden flex items-center justify-center p-6">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-contain max-h-[360px] drop-shadow-2xl"
                  />
                  {selectedProduct.badge && (
                    <div className="absolute top-4 left-4">
                      <span className="px-2.5 py-1 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider bg-red-600 text-white">
                        {selectedProduct.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: Info & Controls */}
                <div className="p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    {/* Category & SKU */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">
                      <span className="text-red-500 font-bold">
                        {categoryLabels[selectedProduct.category] || selectedProduct.category}
                      </span>
                      <span>SKU: {selectedProduct.sku || `RAS-${selectedProduct.id}`}</span>
                    </div>

                    {/* Title */}
                    <h2 className="font-orbitron text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight mb-2">
                      {selectedProduct.name}
                    </h2>

                    {/* Rating & Stock */}
                    <div className="flex items-center gap-3 text-xs mb-4">
                      <div className="flex items-center gap-1 text-amber-500 font-mono font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        {selectedProduct.rating || 4.9} / 5.0
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-emerald-500 font-mono text-xs flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" />
                        {selectedProduct.stockStatus || 'In Stock'}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="font-orbitron text-2xl font-black text-foreground mb-4 pb-4 border-b border-foreground/5 dark:border-white/5">
                      {selectedProduct.price}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                      {selectedProduct.description}
                    </p>

                    {/* Feature bullets if available */}
                    {selectedProduct.features && (
                      <div className="space-y-1.5 mb-5">
                        {selectedProduct.features.map((feat, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-xs text-muted-foreground"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Size Selector (If apparel) */}
                    {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                      <div className="mb-5">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
                          Select Size: <strong className="text-foreground">{modalSize}</strong>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedProduct.sizes.map((sz) => (
                            <button
                              key={sz}
                              onClick={() => setModalSize(sz)}
                              className={`w-10 h-9 rounded-lg font-mono text-xs font-bold transition-all border ${
                                modalSize === sz
                                  ? 'bg-red-500 border-red-500 text-white shadow-md'
                                  : 'bg-foreground/5 dark:bg-white/5 border-foreground/10 dark:border-white/10 hover:border-red-500/50 text-foreground'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                        Quantity:
                      </span>
                      <div className="flex items-center border border-foreground/10 dark:border-white/10 rounded-lg overflow-hidden bg-foreground/5 dark:bg-white/5">
                        <button
                          onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                          className="w-8 h-8 flex items-center justify-center hover:bg-foreground/10 dark:hover:bg-white/10 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center font-mono font-bold text-xs">
                          {modalQty}
                        </span>
                        <button
                          onClick={() => setModalQty((q) => q + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-foreground/10 dark:hover:bg-white/10 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground ml-auto">
                        Subtotal:{' '}
                        <strong className="text-foreground">
                          {(selectedProduct.priceNum * modalQty).toFixed(2)} TND
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Modal CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-foreground/5 dark:border-white/5">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct, modalSize, modalQty);
                        setSelectedProduct(null);
                        setIsCartOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-red-500/20 active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Bag • {(selectedProduct.priceNum * modalQty).toFixed(2)} TND
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 6. SLIDE-OVER CART / INQUIRY DRAWER                          */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className="relative w-full max-w-md bg-background dark:bg-[#09090d] border-l border-foreground/10 dark:border-white/10 h-full flex flex-col z-10 shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-foreground/5 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-orbitron font-bold text-sm text-foreground uppercase tracking-tight">
                      Your Order Bag
                    </h3>
                    <p className="text-[10px] font-mono text-muted-foreground">
                      {totalCartCount} item{totalCartCount !== 1 ? 's' : ''} ready for campus handoff
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-foreground/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                {cart.length > 0 ? (
                  cart.map((cartItem, index) => (
                    <div
                      key={`${cartItem.item.id}-${cartItem.size || 'std'}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-foreground/[0.02] dark:bg-white/[0.02] border border-foreground/5 dark:border-white/5"
                    >
                      <img
                        src={cartItem.item.image}
                        alt={cartItem.item.name}
                        className="w-14 h-14 object-cover rounded-md bg-foreground/5 dark:bg-white/5 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-orbitron text-xs font-bold text-foreground truncate uppercase">
                          {cartItem.item.name}
                        </h4>
                        <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                          {cartItem.size && (
                            <span className="text-red-400 font-bold mr-2">
                              Size: {cartItem.size}
                            </span>
                          )}
                          <span>{cartItem.item.price}</span>
                        </div>
                        {/* Qty controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(index, -1)}
                            className="w-5 h-5 rounded flex items-center justify-center bg-foreground/5 dark:bg-white/5 hover:bg-red-500 hover:text-white transition-colors"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="font-mono text-xs font-bold w-4 text-center">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(index, 1)}
                            className="w-5 h-5 rounded flex items-center justify-center bg-foreground/5 dark:bg-white/5 hover:bg-red-500 hover:text-white transition-colors"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-orbitron font-bold text-xs text-foreground">
                          {(cartItem.item.priceNum * cartItem.quantity).toFixed(2)} TND
                        </div>
                        <button
                          onClick={() => updateQuantity(index, -cartItem.quantity)}
                          className="text-[10px] text-muted-foreground hover:text-red-500 transition-colors mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <h4 className="font-orbitron text-sm font-bold text-foreground uppercase">
                      Your bag is empty
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                      Explore our official chapter merch and robotics hardware kits to add items.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 px-4 py-2 rounded-lg bg-red-600 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-red-500 transition-colors"
                    >
                      Browse Catalog
                    </button>
                  </div>
                )}
              </div>

              {/* Drawer Footer & Checkout */}
              {cart.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-foreground/5 dark:border-white/5 bg-foreground/[0.01] dark:bg-white/[0.01]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-muted-foreground">Order Subtotal:</span>
                    <span className="font-orbitron text-lg font-black text-foreground">
                      {totalCartPrice.toFixed(2)} TND
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-mono mb-4 flex items-center gap-2">
                    <PackageCheck className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Free pickup at ENIS Sfax RAS Club Room or Sfax campus delivery.</span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={copyOrderSummary}
                      className="w-full py-3 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                    >
                      {copiedOrder ? (
                        <>
                          <Check className="w-4 h-4" /> Order Summary Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Copy Order Summary for Club Desk
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setCart([])}
                      className="w-full py-2 text-center text-[10px] font-mono text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      Clear Bag
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 7. TOAST NOTIFICATION BANNER                                 */}
      {/* ============================================================ */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-black/90 dark:bg-white text-white dark:text-black shadow-2xl border border-white/10 dark:border-black/10 text-xs font-mono font-bold"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
