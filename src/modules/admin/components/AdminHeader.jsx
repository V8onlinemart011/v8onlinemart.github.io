import React from 'react';
import { Bell, Search, Globe, ShieldCheck, LogOut, Package, AlertTriangle } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';

export const AdminHeader = ({ title = 'ADMIN DASHBOARD' }) => {
  const { 
    lowStockProducts, 
    orders, 
    lang, 
    setLang, 
    adminLogout 
  } = useStore();

  const lowStockCount = lowStockProducts.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  return (
    <header className="h-16 bg-slate-900/90 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
      <div className="flex items-center space-x-3">
        <h1 className="text-base sm:text-lg font-black text-white tracking-tight uppercase">
          {title}
        </h1>
        <span className="hidden sm:inline-flex items-center space-x-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>SUPER ADMIN</span>
        </span>
      </div>

      <div className="flex items-center space-x-3">
        {/* Low Stock Badge */}
        {lowStockCount > 0 && (
          <div 
            title={`${lowStockCount} products low in stock!`}
            className="flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-xl text-xs font-bold"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>{lowStockCount} Low Stock</span>
          </div>
        )}

        {/* Language Switcher */}
        <button
          onClick={() => setLang(lang === 'km' ? 'en' : 'km')}
          className="flex items-center space-x-1 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 transition cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === 'km' ? 'ភាសាខ្មែរ (KM)' : 'English (EN)'}</span>
        </button>

        {/* Logout */}
        <button
          onClick={adminLogout}
          title="Logout"
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
