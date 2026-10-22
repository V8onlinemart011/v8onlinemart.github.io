import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../../context/StoreContext';
import { resolveAssetUrl, handleImageError } from '../../../utils/resolveAssetUrl';
import { getProductUnitBadge, cleanProductTitle } from '../../../utils/unitHelper';
import { 
  Heart, ShoppingBag, Plus, Minus, 
  ShieldCheck, Truck, AlertTriangle, Zap, ArrowLeft, Package
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    products, 
    lang, 
    t, 
    formatPrice, 
    formatDualPrice,
    addToCart, 
    wishlist, 
    toggleWishlist,
    setIsCheckoutOpen
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const product = products.find(p => String(p.id) === String(id)) || products[0];

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Product Not Found</h2>
        <button
          onClick={() => navigate('/')}
          className="py-2.5 px-5 bg-orange-600 text-white rounded-xl font-bold text-xs"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist.some(item => item.id === product.id);
  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= (product.low_stock_threshold || 5);
  const dual = formatDualPrice(product.price, product.currency);
  const unitBadge = getProductUnitBadge(product, lang);
  const rawTitle = lang === 'km' ? product.title_kh : (product.title_en || product.title_kh);
  const displayTitle = unitBadge ? cleanProductTitle(rawTitle) : rawTitle;
  const activeImageSrc = resolveAssetUrl(product.images?.[activeImageIndex] || product.images?.[0]);

  const handleBuyNow = () => {
    const success = addToCart(product, quantity);
    if (success) {
      setIsCheckoutOpen(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{lang === 'km' ? 'ត្រឡប់ទៅទំព័រដើម' : 'Back to Home'}</span>
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-soft border border-slate-200 dark:border-slate-800 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 relative">
            <img
              src={activeImageSrc}
              alt={rawTitle}
              onError={handleImageError}
              loading="lazy"
              decoding="async"
              width="800"
              height="800"
              className="w-full h-full object-cover"
            />
            {unitBadge && (
              <div className="absolute top-3 left-3 z-10">
                <span className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-black shadow-md backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border ${unitBadge.badgeClasses}`}>
                  <span className="text-sm">{unitBadge.emoji}</span>
                  <span>{unitBadge.label}</span>
                </span>
              </div>
            )}
            {product.discount > 0 && !unitBadge && (
              <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                -{product.discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex items-center space-x-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                    activeImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-200 dark:ring-emerald-900' : 'border-slate-200 dark:border-slate-700 opacity-60'
                  }`}
                >
                  <img src={resolveAssetUrl(img)} alt="thumb" onError={handleImageError} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold block truncate">
                  {lang === 'km' ? product.category_name_kh : product.category_name_en}
                </span>
                {unitBadge && (
                  <span className={`inline-flex items-center space-x-1 text-[11px] font-black px-2 py-0.5 rounded-lg border flex-shrink-0 ${unitBadge.badgeClasses}`}>
                    <span>{unitBadge.emoji}</span>
                    <span>{unitBadge.label}</span>
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                {displayTitle}
              </h1>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline space-x-2 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {dual.primary}
                  </span>
                  {unitBadge && (
                    <span className="text-sm font-black text-slate-600 dark:text-slate-300">
                      {unitBadge.perText}
                    </span>
                  )}
                  {product.original_price && (
                    <span className="text-xs text-slate-400 line-through">
                      {formatPrice(product.original_price, product.currency)}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">≈ {dual.secondary}</span>
              </div>

              <div>
                {isOutOfStock ? (
                  <span className="text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800">
                    {t.outOfStock}
                  </span>
                ) : isLowStock ? (
                  <span className="text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800 flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span>{t.onlyLeft} {product.stock_quantity} left</span>
                  </span>
                ) : (
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {t.inStock}
                  </span>
                )}
              </div>
            </div>

            {/* Dedicated Packaging Unit Card (ឯកតាគិតទំនិញ) */}
            {unitBadge && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-lg shadow-xs border border-slate-200/60 dark:border-slate-600">
                    {unitBadge.emoji}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      {lang === 'km' ? 'ឯកតាគិតទំនិញ (Packaging Unit)' : 'Packaging & Sale Unit'}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      {unitBadge.label} ({unitBadge.label_en})
                    </span>
                  </div>
                </div>
                <span className={`text-[11px] font-black px-2.5 py-1 rounded-xl border ${unitBadge.badgeClasses}`}>
                  {unitBadge.fullBadge}
                </span>
              </div>
            )}

            {/* Description */}
            {(product.description_kh || product.description_en) && (
              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <p>{lang === 'km' ? (product.description_kh || product.description_en) : (product.description_en || product.description_kh)}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <Truck className="w-4 h-4 text-orange-500" />
                <span>30-Min Express Delivery</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Guaranteed Quality</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            {!isOutOfStock && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {lang === 'km' ? 'ចំនួនទិញ (Quantity):' : 'Quantity:'}
                </span>
                <div className="flex items-center space-x-2 border border-slate-200 dark:border-slate-700 rounded-xl p-1 bg-slate-50 dark:bg-slate-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 transition cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-800 dark:text-slate-100">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    disabled={quantity >= product.stock_quantity}
                    className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                  isWishlisted 
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300' 
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                onClick={() => addToCart(product, quantity)}
                disabled={isOutOfStock}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-900 active:scale-98 text-white text-xs font-bold flex items-center justify-center space-x-2 disabled:opacity-40 transition shadow-sm cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{lang === 'km' ? 'ដាក់ក្នុងកន្ត្រក' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 active:scale-98 text-white text-xs font-black flex items-center justify-center space-x-2 disabled:opacity-40 shadow-md shadow-orange-600/25 transition cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>{lang === 'km' ? 'បញ្ជាទិញភ្លាមៗ' : 'Buy Now'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
