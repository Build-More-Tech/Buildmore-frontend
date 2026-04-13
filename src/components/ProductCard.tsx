import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Heart, Star, FileText } from 'lucide-react';
import { formatPrice } from '../utils/currency';

interface ProductCardProps {
  product: any;
  isDark: boolean;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isDark, viewMode = 'grid' }) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(() => {
    try {
      const saved: string[] = JSON.parse(localStorage.getItem('buildmore_wishlist') || '[]');
      return saved.includes(String(product.id));
    } catch { return false; }
  });

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isWishlisted;
    setIsWishlisted(next);
    try {
      const saved: string[] = JSON.parse(localStorage.getItem('buildmore_wishlist') || '[]');
      const id = String(product.id);
      const updated = next ? [...saved, id] : saved.filter(wid => wid !== id);
      localStorage.setItem('buildmore_wishlist', JSON.stringify(updated));
    } catch {}
  };

  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 10;
  const skuCode = `BM-${String(product.id).slice(-8).toUpperCase()}`;

  if (viewMode === 'list') {
    return (
      <div className={`group flex gap-0 rounded-lg border overflow-hidden transition-all duration-200 ${
        isDark
          ? 'bg-zinc-900 border-white/8 hover:border-yellow-400/20 hover:shadow-lg hover:shadow-black/30'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md hover:shadow-slate-100'
      }`}>
        {/* Image */}
        <div className={`w-40 flex-shrink-0 flex items-center justify-center p-3 ${isDark ? 'bg-zinc-800/60' : 'bg-slate-50'}`}>
          <img
            src={product.image}
            alt={product.name}
            className="max-h-32 max-w-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between p-4 py-3">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {product.category}
                  </span>
                  <span className={`text-[10px] font-mono ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                    {skuCode}
                  </span>
                  {/* Stock badge */}
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm tracking-wide ${
                    lowStock
                      ? 'bg-amber-100 text-amber-700'
                      : inStock
                        ? 'bg-emerald-100 text-emerald-700'
                        : isDark ? 'bg-zinc-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {lowStock ? 'LOW STOCK' : inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                  </span>
                </div>
                <Link to={`/product/${product.id}`}>
                  <h3 className={`font-semibold text-base leading-snug transition-colors ${
                    isDark ? 'text-slate-100 hover:text-yellow-400' : 'text-slate-800 hover:text-yellow-600'
                  }`}>
                    {product.name}
                  </h3>
                </Link>
                {product.desc && (
                  <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {product.desc}
                  </p>
                )}
              </div>
              <button
                onClick={handleWishlist}
                className={`flex-shrink-0 w-8 h-8 rounded flex items-center justify-center transition-colors ${
                  isWishlisted
                    ? 'text-red-500'
                    : isDark ? 'text-slate-600 hover:text-slate-400' : 'text-slate-300 hover:text-slate-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          <div className={`flex items-center justify-between mt-3 pt-3 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
            <div className="flex items-baseline gap-2">
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {formatPrice(product.price)}
              </span>
              <span className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>/ unit</span>
              {product.originalPrice && (
                <span className={`text-sm line-through ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discount && (
                <span className="text-[10px] font-bold bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded">
                  {product.discount} OFF
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/rfqs"
                className={`flex items-center gap-1.5 px-3 py-2 rounded border text-xs font-semibold transition-colors ${
                  isDark
                    ? 'border-white/10 text-slate-300 hover:border-yellow-400/30 hover:text-yellow-400'
                    : 'border-slate-200 text-slate-600 hover:border-yellow-400 hover:text-yellow-600'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Get Quote
              </Link>
              <Link
                to={`/product/${product.id}`}
                className={`px-3 py-2 rounded border text-xs font-semibold transition-colors ${
                  isDark
                    ? 'border-white/10 text-slate-300 hover:border-white/20'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Details
              </Link>
              <button
                onClick={handleAdd}
                disabled={!inStock}
                className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold transition-all ${
                  added
                    ? 'bg-emerald-500 text-white'
                    : inStock
                      ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                      : isDark ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {added ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <ShoppingBag className="w-3.5 h-3.5" />
                )}
                {added ? 'Added' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className={`group relative flex flex-col rounded-lg border overflow-hidden transition-all duration-200 ${
      isDark
        ? 'bg-zinc-900 border-white/8 hover:border-yellow-400/20 hover:shadow-xl hover:shadow-black/40'
        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100'
    }`}>
      {/* Image */}
      <div className={`relative h-44 flex items-center justify-center p-4 ${isDark ? 'bg-zinc-800/50' : 'bg-slate-50'}`}>
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
          referrerPolicy="no-referrer"
        />

        {/* Stock badge */}
        <div className="absolute top-2 left-2">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm tracking-wide ${
            lowStock
              ? 'bg-amber-400/90 text-amber-900'
              : inStock
                ? 'bg-emerald-500/90 text-white'
                : 'bg-zinc-600/90 text-zinc-300'
          }`}>
            {lowStock ? 'LOW STOCK' : inStock ? 'IN STOCK' : 'OUT OF STOCK'}
          </span>
        </div>

        {/* Discount badge */}
        {product.discount && (
          <div className="absolute top-2 right-8">
            <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
              {product.discount}
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 w-7 h-7 rounded flex items-center justify-center transition-colors ${
            isWishlisted
              ? 'text-red-500'
              : isDark ? 'text-zinc-600 hover:text-zinc-400' : 'text-slate-300 hover:text-slate-500'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick view */}
        <Link
          to={`/product/${product.id}`}
          className="absolute inset-0 z-10 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-gradient-to-t from-black/50 to-transparent"
        >
          <span className="px-4 py-1.5 bg-white text-black text-[11px] font-semibold rounded tracking-wide shadow-lg">
            View Details
          </span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3">
        {/* Category + SKU row */}
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {product.category}
          </span>
          <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
            {skuCode}
          </span>
        </div>

        {/* Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className={`font-semibold text-sm leading-snug line-clamp-2 transition-colors mb-1.5 ${
            isDark ? 'text-slate-100 hover:text-yellow-400' : 'text-slate-800 hover:text-yellow-600'
          }`}>
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating != null && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-2.5 h-2.5 ${star <= Math.round(product.rating) ? 'text-yellow-400 fill-current' : isDark ? 'text-zinc-700' : 'text-slate-200'}`}
                />
              ))}
            </div>
            <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {product.rating.toFixed(1)} ({product.reviews || 0})
            </span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Pricing */}
        <div className={`pt-2.5 mt-2 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
          <div className="flex items-end justify-between mb-2">
            <div>
              <div className={`text-lg font-bold leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {formatPrice(product.price)}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>/ unit</span>
                {product.originalPrice && (
                  <span className={`text-[10px] line-through ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleAdd}
              disabled={!inStock}
              className={`w-8 h-8 rounded flex items-center justify-center transition-all ${
                added
                  ? 'bg-emerald-500 text-white'
                  : inStock
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                    : isDark ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {added ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Get Quote CTA */}
          <Link
            to="/rfqs"
            className={`flex items-center justify-center gap-1.5 w-full py-1.5 rounded border text-[11px] font-semibold transition-colors ${
              isDark
                ? 'border-white/8 text-slate-400 hover:border-yellow-400/30 hover:text-yellow-400'
                : 'border-slate-200 text-slate-500 hover:border-yellow-400 hover:text-yellow-600'
            }`}
          >
            <FileText className="w-3 h-3" />
            Request Quote
          </Link>
        </div>
      </div>
    </div>
  );
};
