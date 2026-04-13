import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Search, ArrowLeft, ShoppingCart, Sparkles } from 'lucide-react';
import { shopItems } from '../data/shop';

export default function AllProducts({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Products');
  const sectionRef = useRef<HTMLDivElement>(null);

  const categories = ['All Products', 'Merch', 'Books', 'Electronics', 'Service'];

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.product-grid-item',
        { opacity: 0, scale: 0.95, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const filteredProducts = shopItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All Products' || 
      item.category.toLowerCase() === activeCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div ref={sectionRef} className="min-h-screen bg-transparent pt-0 pb-20">
      {/* Search & Filter Header */}
      <div className="relative border-b border-white/5 bg-transparent sticky top-0 z-40 backdrop-blur-2xl pt-4">
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
                <h1 className="font-orbitron text-2xl font-bold text-white uppercase tracking-tight">Full <span className="text-red-500">Catalog</span></h1>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Total {shopItems.length} Products</p>
              </div>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Find gear or components..."
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

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((item) => (
              <div 
                key={item.id} 
                className="product-grid-item group bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden hover:border-red-500/30 hover:bg-white/[0.05] transition-all duration-500 flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-white/[0.01]">
                   {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 text-[9px] font-bold text-red-400 uppercase tracking-widest rounded-lg">
                      {item.category}
                    </span>
                  </div>

                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" 
                    loading="lazy"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                  
                  {/* Quick AddOverlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
                    <button className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-[9px] uppercase tracking-widest rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all">
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-orbitron text-sm font-bold text-white mb-2 group-hover:text-red-500 transition-colors uppercase truncate">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-[11px] mb-4 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="font-orbitron font-bold text-white text-md">
                      {item.price}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-gray-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="text-xl font-orbitron text-white">No products match your criteria.</h3>
            <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
