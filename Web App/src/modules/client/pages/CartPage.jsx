import React from 'react';
import { useStore } from '../../../context/StoreContext';
import { resolveAssetUrl, handleImageError } from '../../../utils/resolveAssetUrl';
import { getProductUnitBadge, cleanProductTitle } from '../../../utils/unitHelper';
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, 
  Truck, ShieldCheck, ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CartPage = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    cartSubtotal, 
    cartItemCount, 
    shippingFee, 
    cartTotal, 
    isInBoreyTheFlora,
    setIsInBoreyTheFlora,
    formatPrice,
    formatDualPrice,
    lang, 
    t,
    setIsCheckoutOpen 
  } = useStore();

  const freeShippingThreshold = 20;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleProceedToCheckout = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'km' ? 'ត្រឡប់ទៅហាង' : 'Back to Store'}</span>
        </button>
        <div className="flex items-center space-x-2">
          <ShoppingBag className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <h1 className="text-xl font-black text-slate-900 dark:text-white">{t.yourCart}</h1>
          <span className="bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-900">
            {cartItemCount}
          </span>
        </div>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 transition cursor-pointer"
          >
            {lang === 'km' ? 'សម្អាតរទេះ' : 'Clear Cart'}
          </button>
        )}
      </div>

      {/* Free Shipping Progress */}
      <div className="p-4 bg-orange-50/70 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 rounded-2xl">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          <div className="flex items-center space-x-1.5 text-orange-800 dark:text-orange-300">
            <Truck className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span>
              {amountToFreeShipping > 0
                ? t.freeShippingProgress.replace('{amount}', formatPrice(amountToFreeShipping))
                : t.freeShippingQualified}
            </span>
          </div>
          <span className="text-[11px] font-mono text-orange-700 dark:text-orange-400 font-bold">{Math.round(freeShippingPercent)}%</span>
        </div>
        <div className="w-full h-2.5 bg-orange-200/70 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${freeShippingPercent}%` }}
          />
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4 shadow-soft">
          <div className="w-20 h-20 rounded-full bg-orange-50 dark:bg-orange-950 text-orange-500 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{t.emptyCart}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">{t.emptyCartDesc}</p>
          <button
            onClick={() => navigate('/')}
            className="py-3 px-6 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-orange-600/20 cursor-pointer"
          >
            {t.startShopping}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => {
              const unitBadge = getProductUnitBadge(item, lang);
              return (
                <div 
                  key={item.id} 
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4"
                >
                  <img
                    src={resolveAssetUrl(item.product_image)}
                    alt={item.product_title_en}
                    onError={handleImageError}
                    loading="lazy"
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-800 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {cleanProductTitle(lang === 'km' ? item.product_title_kh : item.product_title_en)}
                    </h5>
                    <div className="flex items-center space-x-2 my-1 flex-wrap">
                      <span className="text-xs text-slate-400 font-mono">{item.sku}</span>
                      {unitBadge && (
                        <span className={`inline-flex items-center space-x-1 text-[10px] font-black px-2 py-0.5 rounded-full border ${unitBadge.badgeClasses}`}>
                          <span>{unitBadge.emoji}</span>
                          <span>{unitBadge.label}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline space-x-1.5 flex-wrap">
                        <span className="text-base font-black text-orange-600 dark:text-orange-400">
                          {formatPrice(item.unit_price * item.quantity)}
                        </span>
                        {unitBadge && (
                          <span className="text-[11px] text-slate-400 font-medium">
                            ({item.quantity} {unitBadge.shortLabel})
                          </span>
                        )}
                      </div>
                    
                    <div className="flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700 rounded-xl p-1 bg-slate-50 dark:bg-slate-800">
                      <button
                        onClick={() => updateCartQuantity(item.product_id, -1)}
                        className="p-1 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product_id, 1)}
                        className="p-1 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                </div>
              );
            })}
          </div>

          {/* Checkout Summary */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft h-fit space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
              {lang === 'km' ? 'សរុបការបញ្ជាទិញ' : 'Order Summary'}
            </h3>

            {/* Delivery Option */}
            <div 
              onClick={() => setIsInBoreyTheFlora(!isInBoreyTheFlora)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                isInBoreyTheFlora 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 ring-2 ring-emerald-500/20' 
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              <label className="flex items-start space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isInBoreyTheFlora}
                  onChange={(e) => setIsInBoreyTheFlora(e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 mt-0.5 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300 cursor-pointer flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      🏡 {lang === 'km' ? 'ខ្ញុំនៅក្នុងបុរី The Flora' : 'In Borey The Flora'}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.2 rounded-full ${
                      isInBoreyTheFlora ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isInBoreyTheFlora ? 'Free 0 ៛' : '+6,000 ៛'}
                    </span>
                  </div>
                </div>
              </label>
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{t.shippingFee}</span>
                <span className={`font-black font-mono ${isInBoreyTheFlora ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                  {isInBoreyTheFlora ? '0 KHR (Free 🎉)' : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-200 dark:border-slate-800">
                <span>{t.total}</span>
                <div className="text-right">
                  <span className="text-lg text-orange-600 dark:text-orange-400 block leading-none font-mono">{formatPrice(cartTotal)}</span>
                  <span className="text-[11px] text-slate-400 font-normal">≈ {formatDualPrice(cartTotal).khr}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 active:scale-98 text-white font-black text-sm rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-orange-600/25 transition cursor-pointer"
            >
              <span>{t.checkout}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-slate-400 flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant ABA KHQR / Card Checkout</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
