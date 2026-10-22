import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, CheckCircle2, PackageCheck } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { resolveAssetUrl, handleImageError } from '../../../utils/resolveAssetUrl';

export const LowStockAlert = ({ onFilterLowStock }) => {
  const navigate = useNavigate();
  const { lowStockProducts = [], lang } = useStore();

  const handleNavigate = () => {
    if (onFilterLowStock) {
      onFilterLowStock();
    } else {
      navigate('/admin/inventory');
    }
  };

  if (!lowStockProducts || lowStockProducts.length === 0) {
    return (
      <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-100">
              {lang === 'km' ? 'ស្តុកទាំងអស់មានស្ថានភាពល្អ (Stock Normal)' : 'All Inventory Stock Normal'}
            </h4>
            <p className="text-[11px] text-emerald-400/80">
              {lang === 'km' ? 'គ្មានទំនិញណាជិតអស់ពីស្តុកនៅឡើយទេ' : 'No items are currently below safety threshold'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/30 via-slate-900/90 to-slate-900/90 border border-amber-500/25 rounded-2xl p-3.5 sm:p-4.5 shadow-lg space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                {lang === 'km' ? 'ការព្រមានទំនិញជិតអស់ពីស្តុក' : 'Low Stock Warning'}
              </h3>
              <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0">
                {lowStockProducts.length} {lang === 'km' ? 'មុខ' : 'items'}
              </span>
            </div>
            <p className="text-[11px] text-amber-200/70 truncate hidden sm:block">
              {lang === 'km' ? 'សូមពិនិត្យ និងបន្ថែមស្តុក (Stock IN) ឡើងវិញ' : 'Products below safety threshold needing restock'}
            </p>
          </div>
        </div>

        <button
          onClick={handleNavigate}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition cursor-pointer flex-shrink-0"
        >
          <span>{lang === 'km' ? 'មើលទាំងអស់' : 'View All'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal Scroll of Low Stock Items */}
      <div className="flex space-x-2.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-800">
        {lowStockProducts.map((product) => (
          <div
            key={product.id}
            onClick={handleNavigate}
            className="flex-shrink-0 w-44 sm:w-52 bg-slate-950/70 hover:bg-slate-950 border border-amber-500/20 hover:border-amber-500/40 rounded-xl p-2.5 flex items-center space-x-2.5 shadow-sm transition cursor-pointer group"
          >
            <img
              src={resolveAssetUrl(product.images?.[0])}
              alt={product.title_en}
              onError={handleImageError}
              className="w-10 h-10 rounded-lg object-cover border border-slate-800 flex-shrink-0 group-hover:scale-105 transition-transform"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-[11px] sm:text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                {lang === 'km' ? product.title_kh : product.title_en}
              </h4>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[9px] text-slate-400 font-mono truncate mr-1">{product.sku}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.2 rounded border flex-shrink-0 ${
                  product.stock_quantity === 0
                    ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                }`}>
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

export default LowStockAlert;
