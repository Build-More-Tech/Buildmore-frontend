'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Clock, TrendingUp, ArrowRight, ChevronRight, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BackendProduct, Category, productApi } from '../api';
import { normalizeProduct } from '../utils/normalizeProduct';
import { formatPrice } from '../utils/currency';
import { useTheme } from '../context/ThemeContext';
import { useCategories } from '../context/CategoryContext';

// ── Module-level product cache (shared across all SearchBar instances) ─────────
let _productCache: BackendProduct[] | null = null;
let _fetchPromise: Promise<BackendProduct[]> | null = null;

function prefetchProducts() {
  if (_productCache || _fetchPromise) return;
  _fetchPromise = productApi
    .getAll({ limit: 500 })
    .then(r => { _productCache = r.products || []; return _productCache!; })
    .catch(() => { _fetchPromise = null; return [] as BackendProduct[]; });
}

async function getProducts(): Promise<BackendProduct[]> {
  if (_productCache) return _productCache;
  if (!_fetchPromise) prefetchProducts();
  return _fetchPromise!;
}

// ── Recent searches ────────────────────────────────────────────────────────────
const RECENT_KEY = 'buildmore_recent_searches';
const MAX_RECENT = 6;

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}
function saveRecent(term: string) {
  const list = getRecent().filter(t => t.toLowerCase() !== term.toLowerCase());
  localStorage.setItem(RECENT_KEY, JSON.stringify([term, ...list].slice(0, MAX_RECENT)));
}
function clearAllRecent() { localStorage.removeItem(RECENT_KEY); }

const POPULAR_TERMS = ['MCB', 'PVC Pipe', 'Wire', 'LED Bulb', 'Paint', 'Plywood', 'Switch', 'Tape', 'Valve', 'Cement'];

// ── Highlight matching text ────────────────────────────────────────────────────
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-400/25 text-yellow-500 font-black not-italic rounded-sm px-px">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ── Types ──────────────────────────────────────────────────────────────────────
type SuggestionItem =
  | { kind: 'submit';   label: string }
  | { kind: 'recent';   label: string }
  | { kind: 'popular';  label: string }
  | { kind: 'category'; cat: Category }
  | { kind: 'product';  product: BackendProduct };

export interface SearchBarProps {
  /** Pre-loaded products. When omitted, SearchBar fetches & caches them internally. */
  products?: BackendProduct[];
  /** Pre-loaded categories. When omitted, uses CategoryContext. */
  categories?: Category[];
  value: string;
  onChange: (v: string) => void;
  /**
   * Called when user selects a category suggestion.
   * When omitted, SearchBar navigates to /products/:slug automatically.
   */
  onSelectCategory?: (cat: Category) => void;
  /**
   * Called when user commits a text search (Enter / "Search for…").
   * When omitted, SearchBar only updates the value via onChange.
   */
  onSubmit?: (query: string) => void;
  /** Called after any navigation (product page, category page, submit). Use to close overlays. */
  onNavigate?: () => void;
  autoFocus?: boolean;
  placeholder?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────
export const SearchBar: React.FC<SearchBarProps> = ({
  products: productsProp,
  categories: categoriesProp,
  value,
  onChange,
  onSelectCategory,
  onSubmit,
  onNavigate,
  autoFocus = false,
  placeholder = 'Search products, categories...',
}) => {
  const { isDark } = useTheme();
  const router = useRouter();
  const { categories: ctxCategories } = useCategories();

  // Resolved data — use props if provided, else fall back to context / internal fetch
  const [internalProducts, setInternalProducts] = useState<BackendProduct[]>(_productCache ?? []);
  const effectiveProducts  = productsProp  ?? internalProducts;
  const effectiveCategories = categoriesProp ?? ctxCategories;

  // Prefetch products in the background when we're self-managing
  useEffect(() => {
    if (productsProp) return;
    getProducts().then(p => setInternalProducts(p)).catch(() => {});
  }, [productsProp]);

  const [open, setOpen]     = useState(false);
  const [cursor, setCursor] = useState(-1);
  const [recent, setRecent] = useState<string[]>(getRecent);
  const wrapRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus support
  useEffect(() => {
    if (autoFocus) setTimeout(() => inputRef.current?.focus(), 30);
  }, [autoFocus]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false); setCursor(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const q  = value.trim();
  const ql = q.toLowerCase();

  const matchedCategories = ql
    ? effectiveCategories.filter(c => c.name.toLowerCase().includes(ql)).slice(0, 3)
    : [];
  const matchedProducts = ql
    ? effectiveProducts.filter(p => p.productName.toLowerCase().includes(ql)).slice(0, 5)
    : [];

  // Flat list for keyboard navigation
  const items: SuggestionItem[] = [];
  if (q) {
    items.push({ kind: 'submit', label: q });
    matchedCategories.forEach(cat     => items.push({ kind: 'category', cat }));
    matchedProducts  .forEach(product => items.push({ kind: 'product',  product }));
  } else {
    recent       .forEach(r => items.push({ kind: 'recent',  label: r }));
    POPULAR_TERMS.forEach(p => items.push({ kind: 'popular', label: p }));
  }

  const commit = useCallback((item: SuggestionItem) => {
    if (item.kind === 'submit' || item.kind === 'recent' || item.kind === 'popular') {
      saveRecent(item.label);
      setRecent(getRecent());
      onChange(item.label);
      setOpen(false); setCursor(-1);
      onSubmit?.(item.label);
      onNavigate?.();

    } else if (item.kind === 'category') {
      saveRecent(item.cat.name);
      setRecent(getRecent());
      setOpen(false); setCursor(-1);
      if (onSelectCategory) {
        onSelectCategory(item.cat);
      } else {
        const slug = item.cat.slug || item.cat.name.toLowerCase().replace(/\s+/g, '-');
        router.push(`/products/${slug}`);
        onNavigate?.();
      }

    } else if (item.kind === 'product') {
      const norm = normalizeProduct(item.product);
      saveRecent(item.product.productName);
      setRecent(getRecent());
      router.push(`/product/${norm.id}`);
      setOpen(false); setCursor(-1);
      onNavigate?.();
    }
  }, [onChange, onSelectCategory, onSubmit, onNavigate, router]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { setOpen(false); setCursor(-1); return; }
    if (!open) { setOpen(true); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor(c => Math.min(c + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor(c => Math.max(c - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (cursor >= 0 && cursor < items.length) {
        commit(items[cursor]);
      } else if (q) {
        commit({ kind: 'submit', label: q });
      }
    }
  };

  const rowBase = isDark
    ? 'text-slate-300 hover:bg-white/[0.04]'
    : 'text-slate-700 hover:bg-slate-50';
  const rowActive = 'bg-yellow-400 text-black';
  const sectionHdr = isDark
    ? 'text-slate-600 bg-white/[0.02] border-white/5'
    : 'text-slate-400 bg-slate-50 border-slate-100';

  return (
    <div ref={wrapRef} className="relative w-full">
      {/* ── Input ── */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 ${
        open
          ? isDark
            ? 'bg-zinc-900 border-yellow-400/40 shadow-lg shadow-yellow-400/5'
            : 'bg-white border-yellow-400 shadow-lg shadow-yellow-400/10'
          : isDark
          ? 'bg-zinc-900 border-white/10'
          : 'bg-slate-50 border-slate-200'
      }`}>
        <Search className={`w-3.5 h-3.5 shrink-0 transition-colors ${open ? 'text-yellow-500' : 'text-slate-500'}`} />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => { onChange(e.target.value); setCursor(-1); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={`flex-1 bg-transparent text-sm outline-none min-w-0 ${
            isDark ? 'text-white placeholder-slate-600' : 'text-slate-900 placeholder-slate-400'
          }`}
        />
        {value && (
          <button
            onClick={() => { onChange(''); inputRef.current?.focus(); }}
            className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── Dropdown ── */}
      {open && (
        <div className={`absolute top-full left-0 w-full min-w-[320px] mt-1.5 rounded-xl border shadow-2xl z-[200] overflow-hidden ${
          isDark ? 'bg-zinc-950 border-white/10' : 'bg-white border-slate-200'
        }`}>
          {q ? (
            <>
              {/* Search for "…" */}
              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => commit({ kind: 'submit', label: q })}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${cursor === 0 ? rowActive : rowBase}`}
              >
                <Search className="w-3.5 h-3.5 shrink-0" />
                <span className="text-sm font-medium flex-1">
                  Search for{' '}
                  <span className={cursor === 0 ? 'font-black' : 'font-black text-yellow-500'}>
                    "{value}"
                  </span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-50" />
              </button>

              {/* Category matches */}
              {matchedCategories.length > 0 && (
                <>
                  <div className={`px-4 py-1 text-[9px] font-black uppercase tracking-widest border-t ${sectionHdr}`}>
                    Categories
                  </div>
                  {matchedCategories.map((cat, i) => {
                    const idx = 1 + i;
                    return (
                      <button
                        key={cat._id}
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => commit({ kind: 'category', cat })}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${cursor === idx ? rowActive : rowBase}`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cursor === idx ? 'bg-black/10' : isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                          <Layers className="w-3.5 h-3.5 text-yellow-500" />
                        </div>
                        <span className="text-sm font-medium flex-1 text-left">
                          <Highlight text={cat.name} query={q} />
                        </span>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${cursor === idx ? 'text-black/50' : 'text-slate-500'}`}>
                          Category
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-40" />
                      </button>
                    );
                  })}
                </>
              )}

              {/* Product matches */}
              {matchedProducts.length > 0 && (
                <>
                  <div className={`px-4 py-1 text-[9px] font-black uppercase tracking-widest border-t ${sectionHdr}`}>
                    Products
                  </div>
                  {matchedProducts.map((p, i) => {
                    const norm = normalizeProduct(p);
                    const idx  = 1 + matchedCategories.length + i;
                    return (
                      <button
                        key={p._id}
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => commit({ kind: 'product', product: p })}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${cursor === idx ? rowActive : rowBase}`}
                      >
                        <img
                          src={norm.image}
                          alt={norm.name}
                          className={`w-10 h-10 rounded-lg object-cover shrink-0 border ${isDark ? 'border-white/10' : 'border-slate-200'}`}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            <Highlight text={p.productName} query={q} />
                          </p>
                          <p className={`text-xs font-black mt-0.5 ${cursor === idx ? 'text-black/60' : 'text-yellow-500'}`}>
                            {formatPrice(norm.price)}
                          </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-40" />
                      </button>
                    );
                  })}
                </>
              )}

              {/* No results */}
              {matchedCategories.length === 0 && matchedProducts.length === 0 && (
                <div className={`px-4 py-6 text-center ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                  <p className="text-sm font-medium">No results for <span className="font-black text-yellow-500">"{q}"</span></p>
                  <p className="text-xs mt-1">Press Enter to search anyway</p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Recent searches */}
              {recent.length > 0 && (
                <>
                  <div className={`px-4 py-1.5 flex items-center justify-between text-[9px] font-black uppercase tracking-widest border-b ${sectionHdr}`}>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Recent
                    </span>
                    <button
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => { clearAllRecent(); setRecent([]); }}
                      className="normal-case tracking-normal font-bold text-yellow-500 hover:text-yellow-400"
                    >
                      Clear all
                    </button>
                  </div>
                  {recent.map((r, i) => (
                    <button
                      key={r}
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => commit({ kind: 'recent', label: r })}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${cursor === i ? rowActive : rowBase}`}
                    >
                      <Clock className="w-3.5 h-3.5 shrink-0 opacity-40" />
                      <span className="text-sm font-medium flex-1">{r}</span>
                      <ArrowRight className="w-3 h-3 shrink-0 opacity-30" />
                    </button>
                  ))}
                </>
              )}

              {/* Popular searches */}
              <div className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border-t ${sectionHdr}`}>
                <TrendingUp className="w-3 h-3 inline mr-1" /> Popular
              </div>
              <div className="px-4 py-3 flex flex-wrap gap-1.5">
                {POPULAR_TERMS.map((p, i) => {
                  const idx = recent.length + i;
                  return (
                    <button
                      key={p}
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => commit({ kind: 'popular', label: p })}
                      className={`px-3 py-1 rounded-full border text-xs font-semibold transition-all ${
                        cursor === idx
                          ? 'bg-yellow-400 border-yellow-400 text-black'
                          : isDark
                          ? 'border-white/10 text-slate-400 hover:border-yellow-400/30 hover:text-yellow-400'
                          : 'border-slate-200 text-slate-600 hover:border-yellow-400 hover:text-yellow-600'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
