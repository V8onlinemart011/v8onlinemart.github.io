import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Package, PlusCircle, Settings, 
  LogOut, Store, ShoppingCart, Truck, Image as ImageIcon, 
  Bell, Users, Shield, QrCode
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import v8Logo from '../../../assets/iconv8mart.jpg';

export const Sidebar = ({ activeTab, onTabChange }) => {
  const { 
    lowStockProducts, 
    orders, 
    banners = [], 
    adminLogout, 
    lang 
  } = useStore();

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const lowStockCount = lowStockProducts.length;

  const navItems = [
    {
      id: 'overview',
      path: '/admin',
      label_kh: 'ទិដ្ឋភាពរួម (Overview)',
      label_en: 'Dashboard Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'inventory',
      path: '/admin/inventory',
      label_kh: 'គ្រប់គ្រងស្តុក (Stock List)',
      label_en: 'Stock Inventory',
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : null,
      badgeColor: 'bg-rose-500'
    },
    {
      id: 'add-product',
      path: '/admin/add-product',
      label_kh: 'បន្ថែមទំនិញថ្មី (Add Product)',
      label_en: 'Add New Product',
      icon: PlusCircle,
      badge: null
    },
    {
      id: 'orders',
      path: '/admin/orders',
      label_kh: 'ការបញ្ជាទិញ (Orders)',
      label_en: 'Order Management',
      icon: ShoppingCart,
      badge: pendingOrders > 0 ? pendingOrders : null,
      badgeColor: 'bg-orange-500'
    },
    {
      id: 'banners',
      path: '/admin/banners',
      label_kh: 'ផ្ទាំងផ្សាយ (Banners)',
      label_en: 'Banner Ads',
      icon: ImageIcon,
      badge: banners.length > 0 ? banners.length : null,
      badgeColor: 'bg-emerald-600'
    },
    {
      id: 'settings',
      path: '/admin/settings',
      label_kh: 'ការកំណត់ (Settings)',
      label_en: 'Admin Settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 text-slate-100 z-30 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-emerald-500/40 bg-white p-0.5 flex-shrink-0">
            <img src={v8Logo} alt="V8 Mart" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-black text-white tracking-tight truncate">V8 ADMIN PORTAL</h2>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Inventory & Stock</p>
          </div>
        </div>

        {/* Nav list */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id, item.path)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{lang === 'km' ? item.label_kh : item.label_en}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-black text-white rounded-full ${item.badgeColor || 'bg-emerald-500'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Store view & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <a
          href="/"
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
        >
          <Store className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'km' ? 'មើលទំព័រហាង (Storefront)' : 'Go to Storefront'}</span>
        </a>

        <button
          onClick={adminLogout}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{lang === 'km' ? 'ចាកចេញ (Logout)' : 'Logout'}</span>
        </button>
      </div>
    </aside>
  );
};
