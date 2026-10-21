import React from 'react';
import { AlertTriangle, Package, ArrowRight, BellRing } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { resolveAssetUrl, handleImageError } from '../../../utils/resolveAssetUrl';

export const LowStockAlert = ({ onFilterLowStock }) => {
  const { lowStockProducts, lang } = useStore();

  if (!lowStockProducts || lowStockProducts.length === 0) {
    return (
      <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-2xl p-4 flex items-center justify-between text-emerald-300">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            ✓
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">ស្តុកទាំងអស់មានស្ថានភាពល្អ (Stock Normal)</h4>
            <p className="text-xs text-emerald-400">គ្មានទំនិញណាជិតអស់ពីស្តុកទេ</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-slate-900 border border-amber-500/40 rounded-3xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white">
                {lang === 'km' ? 'ការព្រមានទំនិញជិតអស់ពីស្តុក (Low Stock Warning)' : 'Low Stock Warning'}
              </h3>
              <span className="bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm">
                {lowStockProducts.length} items
              </span>
            </div>
            <p className="text-xs text-amber-200/80 mt-0.5">
              {lang === 'km' ? 'សូមពិនិត្យ និងបន្ថែមស្តុក (Stock IN) ឡើងវិញ' : 'Items below safety threshold needing restock'}
            </p>
          </div>
        </div>

        {onFilterLowStock && (
          <button
            onClick={onFilterLowStock}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <span>{lang === 'km' ? 'មើលទំនិញទាំងនេះ' : 'View Items'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Horizontal Scroll of Low Stock Items */}
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-900">
        {lowStockProducts.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-48 bg-slate-900/90 border border-amber-500/30 rounded-2xl p-3 flex items-center space-x-3 shadow-md"
          >
            <img
              src={resolveAssetUrl(product.images?.[0])}
              alt={product.title_en}
              onError={handleImageError}
              className="w-11 h-11 rounded-xl object-cover border border-amber-500/30 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">
                {lang === 'km' ? product.title_kh : product.title_en}
              </h4>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-slate-400 font-mono">{product.sku}</span>
                <span className="text-[11px] font-black text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                  {product.stock_quantity === 0 ? 'Out 0' : `${product.stock_quantity} left`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
