import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, ChevronRight, X, Grid3X3, List, SlidersHorizontal, Package } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { productApi, BackendProduct } from '../api';
import { normalizeProduct } from '../utils/normalizeProduct';

interface ProductsProps {
  isDark: boolean;
}

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Best Rated', value: 'rating' },
];

const PRICE_RANGES = [
  { label: 'Under ₹4,000', min: 0, max: 4000 },
  { label: '₹4,000 - ₹8,000', min: 4000, max: 8000 },
  { label: '₹8,000 - ₹17,000', min: 8000, max: 17000 },
  { label: '₹17,000 - ₹42,000', min: 17000, max: 42000 },
  { label: 'Over ₹42,000', min: 42000, max: Infinity },
];

const RATING_FILTERS = [
  { label: '4★ & above', min: 4 },
  { label: '3★ & above', min: 3 },
  { label: '2★ & above', min: 2 },
  { label: '1★ & above', min: 1 },
];

function FilterSection({ title, children, isDark }: { title: string; children: React.ReactNode; isDark: boolean }) {
  const [open, setOpen] = useState(true);
  const border = isDark ? 'border-white/5' : 'border-slate-100';
  return (
    <div className={`border-b ${border} mb-1`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-2.5 text-left">
        <span className={`text-[10px] font-semibold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{title}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDark ? 'text-zinc-600' : 'text-slate-400'} ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

function FilterCheckbox({ checked, onChange, label, count, isDark }: { checked: boolean; onChange: () => void; label: string; count?: number; isDark: boolean }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group py-0.5">
      <div className="flex items-center gap-2.5" onClick={onChange}>
        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors flex-shrink-0 ${checked ? 'bg-yellow-400 border-yellow-400' : isDark ? 'border-zinc-600 group-hover:border-zinc-500' : 'border-slate-300 group-hover:border-slate-400'}`}>
          {checked && (
            <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <span className={`text-xs font-medium ${checked ? isDark ? 'text-white' : 'text-slate-900' : isDark ? 'text-slate-400' : 'text-slate-600'}`}>{label}</span>
      </div>
      {count !== undefined && <span className={`text-[10px] ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>{count}</span>}
    </label>
  );
}

export const Products: React.FC<ProductsProps> = ({ isDark }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const cat = searchParams.get('category');
    return cat ? [cat] : [];
  });
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<number[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    productApi.getCategories()
      .then(res => setCategories(res.categories || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const category = selectedCategories.length === 1 ? selectedCategories[0] : undefined;
    productApi.getAll(category ? { category } : undefined)
      .then(res => setProducts(res.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [selectedCategories]);

  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('search');
    if (cat || q) {
      if (cat) setSelectedCategories([cat]);
      if (q) setSearch(q);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const togglePriceRange = (idx: number) => {
    setSelectedPriceRanges(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSelectedRating(null);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSearch('');
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedPriceRanges.length > 0 || selectedRating !== null || inStockOnly || onSaleOnly;

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(p => 
        p.productName.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedPriceRanges.length > 0) {
      result = result.filter(p => {
        return selectedPriceRanges.some(idx => {
          const range = PRICE_RANGES[idx];
          return p.price >= range.min && (range.max === Infinity || p.price < range.max);
        });
      });
    }

    if (selectedRating !== null) {
      result = result.filter(p => (p as any).rating >= selectedRating);
    }

    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    if (onSaleOnly) {
      result = result.filter(p => (p as any).discount);
    }

    switch (sortBy) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()); break;
      case 'rating': result.sort((a, b) => ((b as any).rating || 0) - ((a as any).rating || 0)); break;
    }
    return result;
  }, [search, selectedCategories, selectedPriceRanges, selectedRating, inStockOnly, onSaleOnly, sortBy, products]);

  const visible = filtered.slice(0, visibleCount);
  const currentSort = SORT_OPTIONS.find(o => o.value === sortBy)!;

  const activeFiltersCount = selectedCategories.length + selectedPriceRanges.length + (selectedRating !== null ? 1 : 0) + (inStockOnly ? 1 : 0) + (onSaleOnly ? 1 : 0);
  const pageTitle = selectedCategories.length === 1 ? selectedCategories[0] : 'All Products';
  const border = isDark ? 'border-white/8' : 'border-slate-200';

  return (
    <div className={`max-w-[1920px] mx-auto min-h-screen ${isDark ? 'bg-zinc-950' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className={`border-b ${border} ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
        <div className="px-6 py-3">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1 text-xs mb-2">
            <Link to="/" className={`transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>
              Home
            </Link>
            <ChevronRight className={`w-3 h-3 ${isDark ? 'text-zinc-700' : 'text-slate-300'}`} />
            <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{pageTitle}</span>
          </nav>
          <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`lg:hidden flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-semibold ${isDark ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-700'}`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 bg-yellow-400 text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {pageTitle}
            </h1>
            {!loading && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${isDark ? 'bg-zinc-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                {filtered.length.toLocaleString()} products
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className={`hidden md:flex items-center rounded border overflow-hidden ${border}`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-yellow-400 text-black' : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-yellow-400 text-black' : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded border text-xs font-semibold ${isDark ? 'bg-zinc-900 border-white/8 text-slate-300 hover:border-white/15' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}
              >
                <span>Sort: {currentSort.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              {sortOpen && (
                <div className={`absolute right-0 top-full mt-1 w-52 rounded border shadow-xl z-50 overflow-hidden ${isDark ? 'bg-zinc-900 border-white/8' : 'bg-white border-slate-200'}`}>
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${
                        sortBy === opt.value
                          ? 'bg-yellow-400 text-black'
                          : isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:block w-56 flex-shrink-0 border-r ${border} ${isDark ? 'bg-zinc-950' : 'bg-white'} sticky top-[105px] h-[calc(100vh-105px)] overflow-y-auto`}>
          <div className={`flex items-center justify-between px-4 py-3 border-b ${border}`}>
            <span className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Filters</span>
            {hasActiveFilters && (
              <button onClick={clearFilters} className={`text-[10px] font-semibold ${isDark ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-700'}`}>
                Clear all
              </button>
            )}
          </div>
          <div className="p-4">
            {/* Search */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded border mb-4 ${isDark ? 'bg-zinc-900 border-white/8' : 'bg-slate-50 border-slate-200'}`}>
              <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setVisibleCount(12); }}
                placeholder="Search products..."
                className={`flex-1 bg-transparent text-xs font-medium outline-none ${isDark ? 'text-white placeholder-slate-600' : 'text-slate-900 placeholder-slate-400'}`}
              />
              {search && (
                <button onClick={() => setSearch('')} className={`${isDark ? 'text-slate-600 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'}`}>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Categories */}
            <FilterSection title="Category" isDark={isDark}>
              {categories.map(cat => {
                const isSelected = selectedCategories.includes(cat);
                const count = products.filter(p => p.category === cat).length;
                return (
                  <FilterCheckbox key={cat} checked={isSelected} onChange={() => toggleCategory(cat)} label={cat} count={count} isDark={isDark} />
                );
              })}
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Price Range" isDark={isDark}>
              {PRICE_RANGES.map((range, idx) => (
                <FilterCheckbox key={idx} checked={selectedPriceRanges.includes(idx)} onChange={() => togglePriceRange(idx)} label={range.label} isDark={isDark} />
              ))}
            </FilterSection>

            {/* Availability */}
            <FilterSection title="Availability" isDark={isDark}>
              <FilterCheckbox checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)} label="In Stock Only" isDark={isDark} />
              <FilterCheckbox checked={onSaleOnly} onChange={() => setOnSaleOnly(!onSaleOnly)} label="On Sale" isDark={isDark} />
            </FilterSection>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 p-5">
          {/* Mobile quick category pills */}
          <div className="lg:hidden mb-4 flex gap-2 overflow-x-auto pb-1">
            {categories.slice(0, 6).map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1.5 rounded border text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategories.includes(cat)
                    ? 'bg-yellow-400 border-yellow-400 text-black'
                    : isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {selectedCategories.map(cat => (
                <span key={cat} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-medium ${isDark ? 'bg-zinc-800 border-white/8 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
                  {cat}
                  <button onClick={() => toggleCategory(cat)} className="opacity-50 hover:opacity-100"><X className="w-3 h-3" /></button>
                </span>
              ))}
              {selectedPriceRanges.map(idx => (
                <span key={idx} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-medium ${isDark ? 'bg-zinc-800 border-white/8 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
                  {PRICE_RANGES[idx].label}
                  <button onClick={() => togglePriceRange(idx)} className="opacity-50 hover:opacity-100"><X className="w-3 h-3" /></button>
                </span>
              ))}
              {selectedRating !== null && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-medium ${isDark ? 'bg-zinc-800 border-white/8 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
                  {selectedRating}★ & Up
                  <button onClick={() => setSelectedRating(null)} className="opacity-50 hover:opacity-100"><X className="w-3 h-3" /></button>
                </span>
              )}
              {inStockOnly && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-medium ${isDark ? 'bg-zinc-800 border-white/8 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
                  In Stock
                  <button onClick={() => setInStockOnly(false)} className="opacity-50 hover:opacity-100"><X className="w-3 h-3" /></button>
                </span>
              )}
              {onSaleOnly && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-medium ${isDark ? 'bg-zinc-800 border-white/8 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
                  On Sale
                  <button onClick={() => setOnSaleOnly(false)} className="opacity-50 hover:opacity-100"><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}

          {/* Products */}
          {loading ? (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' : 'grid-cols-1'} gap-3`}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className={`rounded-lg border animate-pulse ${isDark ? 'bg-zinc-900 border-white/5' : 'bg-white border-slate-200'}`} style={{ height: viewMode === 'grid' ? '280px' : '130px' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className={`flex flex-col items-center justify-center py-28 rounded-lg border-2 border-dashed ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
              <Package className={`w-10 h-10 mb-3 ${isDark ? 'text-zinc-700' : 'text-slate-300'}`} />
              <h3 className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>No products found</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Try adjusting your filters or search term</p>
              <button onClick={clearFilters} className="px-5 py-2 bg-yellow-400 text-black text-xs font-semibold rounded hover:bg-yellow-300 transition-colors">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3' : 'space-y-2.5'}>
              {visible.map(product => (
                <ProductCard key={product._id} product={normalizeProduct(product)} isDark={isDark} viewMode={viewMode} />
              ))}
            </div>
          )}

          {/* Load more */}
          {visible.length < filtered.length && (
            <div className={`flex items-center justify-between mt-8 pt-6 border-t ${border}`}>
              <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Showing {visible.length} of {filtered.length} products
              </span>
              <button
                onClick={() => setVisibleCount(c => c + 24)}
                className={`px-5 py-2 rounded border text-xs font-semibold transition-colors ${isDark ? 'border-white/10 text-slate-300 hover:border-yellow-400/30 hover:text-yellow-400' : 'border-slate-200 text-slate-700 hover:border-yellow-400 hover:text-yellow-600'}`}
              >
                Load more ({filtered.length - visible.length} remaining)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {filterOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 lg:hidden" onClick={() => setFilterOpen(false)}>
          <div className={`absolute left-0 top-0 h-full w-72 overflow-y-auto ${isDark ? 'bg-zinc-950' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <div className={`flex items-center justify-between px-4 py-3 border-b ${border}`}>
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Filters</span>
              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-[10px] font-semibold text-yellow-500">Clear all</button>
                )}
                <button onClick={() => setFilterOpen(false)}>
                  <X className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <FilterSection title="Category" isDark={isDark}>
                {categories.map(cat => (
                  <FilterCheckbox key={cat} checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} label={cat} count={products.filter(p => p.category === cat).length} isDark={isDark} />
                ))}
              </FilterSection>
              <FilterSection title="Price Range" isDark={isDark}>
                {PRICE_RANGES.map((range, idx) => (
                  <FilterCheckbox key={idx} checked={selectedPriceRanges.includes(idx)} onChange={() => togglePriceRange(idx)} label={range.label} isDark={isDark} />
                ))}
              </FilterSection>
              <FilterSection title="Availability" isDark={isDark}>
                <FilterCheckbox checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)} label="In Stock Only" isDark={isDark} />
              </FilterSection>
            </div>
            <div className="p-4 pt-0">
              <button onClick={() => setFilterOpen(false)} className="w-full py-2.5 bg-yellow-400 text-black text-sm font-semibold rounded">
                View {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};