import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, ShieldCheck, LogOut, AlertTriangle, 
  Menu, ShoppingCart, Store, ChevronRight,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import v8Logo from '../../../assets/iconv8mart.jpg';

export const AdminHeader = ({ 
  title = 'V8 Admin Portal', 
  activeTab = 'overview', 
  onToggleMobileMenu = () => {},
  isDesktopCollapsed = false,
  onToggleDesktopCollapse = () => {}
}) => {
  const navigate = useNavigate();
  const { 
    lowStockProducts = [], 
    orders = [], 
    lang, 
    setLang, 
    fontSize = 'normal',
    setFontSize,
    showToast,
    adminLogout 
  } = useStore();

  const fontSizes = ['small', 'normal', 'large', 'xlarge'];

  const handleCycleFontSize = () => {
    const currentIndex = fontSizes.indexOf(fontSize);
    const nextIndex = (currentIndex + 1) % fontSizes.length;
    const nextSize = fontSizes[nextIndex];
    if (typeof setFontSize === 'function') {
      setFontSize(nextSize);
      if (typeof showToast === 'function') {
        const labels = {
          small: lang === 'km' ? 'តូច (90%)' : 'Compact (90%)',
          normal: lang === 'km' ? 'ស្តង់ដារ (100%)' : 'Standard (100%)',
          large: lang === 'km' ? 'ធំ (115%)' : 'Large (115%)',
          xlarge: lang === 'km' ? 'ធំខ្លាំង (125%)' : 'Extra Large (125%)'
        };
        showToast(
          lang === 'km' 
            ? `🔤 ទំហំអក្សរ៖ ${labels[nextSize]}` 
            : `🔤 Font size: ${labels[nextSize]}`,
          'info'
        );
      }
    }
  };

  const getFontSizePercent = () => {
    switch (fontSize) {
      case 'small': return '90%';
      case 'large': return '115%';
      case 'xlarge': return '125%';
      default: return '100%';
    }
  };

  const lowStockCount = lowStockProducts.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  const getTabBreadcrumb = () => {
    switch (activeTab) {
      case 'inventory': return lang === 'km' ? 'គ្រប់គ្រងស្តុក' : 'Inventory';
      case 'add-product': return lang === 'km' ? 'បន្ថែមទំនិញថ្មី' : 'Add Product';
      case 'orders': return lang === 'km' ? 'ការបញ្ជាទិញ' : 'Orders';
      case 'banners': return lang === 'km' ? 'ផ្ទាំងផ្សាយ' : 'Banners';
      case 'settings': return lang === 'km' ? 'ការកំណត់' : 'Settings';
      default: return lang === 'km' ? 'ទិដ្ឋភាពទូទៅ' : 'Overview';
    }
  };

  return (
    <header className="h-16 bg-slate-950/80 border-b border-slate-800/80 px-3.5 sm:px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl select-none">
      {/* Left: Mobile Drawer Button, Desktop Collapse Toggle & Breadcrumbs */}
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
        {/* Mobile Hamburger Drawer Button (< lg) */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-850 rounded-xl transition cursor-pointer flex-shrink-0"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Sidebar Collapse Toggle Button (lg: and up) */}
        <button
          onClick={onToggleDesktopCollapse}
          className="hidden lg:flex p-2 text-slate-400 hover:text-white hover:bg-slate-850 rounded-xl transition cursor-pointer flex-shrink-0"
          title={isDesktopCollapsed ? 'Expand Sidebar' : 'Hide Sidebar (ពង្រីកអេក្រង់)'}
        >
          {isDesktopCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 text-emerald-400" />
          ) : (
            <PanelLeftClose className="w-5 h-5 text-slate-400 hover:text-slate-200" />
          )}
        </button>

        {/* Small Logo on Mobile */}
        <div className="lg:hidden w-7 h-7 rounded-lg overflow-hidden border border-emerald-500/40 bg-white p-0.5 flex-shrink-0">
          <img src={v8Logo} alt="V8" className="w-full h-full object-contain" />
        </div>

        {/* Breadcrumb / Title */}
        <div className="flex items-center space-x-1.5 min-w-0 truncate">
          <span className="text-xs sm:text-sm font-black text-white tracking-tight truncate">
            V8 Admin
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold text-emerald-400 truncate">
            {getTabBreadcrumb()}
          </span>

          <span className="hidden xl:inline-flex items-center space-x-1 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>SUPER ADMIN</span>
          </span>
        </div>
      </div>

      {/* Right: Actions, Badges & Language Switcher */}
      <div className="flex items-center space-x-1.5 sm:space-x-2.5 flex-shrink-0">
        {/* Pending Orders Pill */}
        {pendingOrdersCount > 0 && (
          <button
            onClick={() => navigate('/admin/orders')}
            title={`${pendingOrdersCount} pending orders`}
            className="flex items-center space-x-1 sm:space-x-1.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 px-2 sm:px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">{pendingOrdersCount} Orders</span>
            <span className="sm:hidden">{pendingOrdersCount}</span>
          </button>
        )}

        {/* Low Stock Warning Pill */}
        {lowStockCount > 0 && (
          <button
            onClick={() => navigate('/admin/inventory')}
            title={`${lowStockCount} products low in stock!`}
            className="flex items-center space-x-1 sm:space-x-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2 sm:px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{lowStockCount} Low Stock</span>
            <span className="sm:hidden">{lowStockCount}</span>
          </button>
        )}

        {/* View Live Storefront */}
        <button
          onClick={() => {
            const baseUrl = import.meta.env.BASE_URL || '/';
            window.location.href = baseUrl;
          }}
          title={lang === 'km' ? 'មើលទំព័រហាង (Storefront)' : 'View Storefront'}
          className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition cursor-pointer"
        >
          <Store className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === 'km' ? 'ទំព័រហាង' : 'Storefront'}</span>
        </button>

        {/* Quick Accessibility Font Size Switcher (1-Tap Cycle) */}
        <button
          onClick={handleCycleFontSize}
          title={
            lang === 'km'
              ? `ទំហំអក្សរបច្ចុប្បន្ន៖ ${getFontSizePercent()} (ចុចដើម្បីប្តូរទំហំអក្សរ)`
              : `Current Font Size: ${getFontSizePercent()} (Click to toggle)`
          }
          className="flex items-center space-x-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-800 transition cursor-pointer"
        >
          <span className="font-serif font-black text-emerald-400 text-xs">Aa</span>
          <span className="text-[10px] font-mono text-slate-300">{getFontSizePercent()}</span>
        </button>

        {/* Language Switcher */}
        <button
          onClick={() => setLang(lang === 'km' ? 'en' : 'km')}
          title="Switch Language"
          className="flex items-center space-x-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-800 transition cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px]">{lang === 'km' ? 'ខ្មែរ' : 'EN'}</span>
        </button>

        {/* Logout */}
        <button
          onClick={adminLogout}
          title={lang === 'km' ? 'ចាកចេញ (Logout)' : 'Logout'}
          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
