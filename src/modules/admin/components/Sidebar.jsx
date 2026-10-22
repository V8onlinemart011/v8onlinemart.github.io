import React from 'react';
import { 
  LayoutDashboard, Package, PlusCircle, Settings, 
  LogOut, Store, ShoppingCart, Image as ImageIcon, 
  X, ExternalLink, ShieldCheck, ChevronRight,
  ChevronLeft, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import v8Logo from '../../../assets/iconv8mart.jpg';

export const Sidebar = ({ 
  activeTab, 
  onTabChange, 
  isOpen = false, 
  onClose = () => {},
  isDesktopCollapsed = false,
  onToggleDesktopCollapse = () => {}
}) => {
  const { 
    lowStockProducts = [], 
    orders = [], 
    banners = [], 
    adminLogout, 
    lang 
  } = useStore();

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const lowStockCount = lowStockProducts.length;

  const navSections = [
    {
      title: lang === 'km' ? 'ផ្ទាំងមេ' : 'MAIN',
      items: [
        {
          id: 'overview',
          path: '/admin',
          label_kh: 'ទិដ្ឋភាពរួម (Overview)',
          label_en: 'Dashboard Overview',
          icon: LayoutDashboard,
          badge: null
        }
      ]
    },
    {
      title: lang === 'km' ? 'គ្រប់គ្រងហាង' : 'MANAGEMENT',
      items: [
        {
          id: 'inventory',
          path: '/admin/inventory',
          label_kh: 'គ្រប់គ្រងស្តុក (Stock)',
          label_en: 'Stock Inventory',
          icon: Package,
          badge: lowStockCount > 0 ? `${lowStockCount}` : null,
          badgeColor: 'bg-rose-500 text-white'
        },
        {
          id: 'add-product',
          path: '/admin/add-product',
          label_kh: 'បន្ថែមទំនិញថ្មី (Add)',
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
          badge: pendingOrders > 0 ? `${pendingOrders}` : null,
          badgeColor: 'bg-orange-500 text-white'
        },
        {
          id: 'banners',
          path: '/admin/banners',
          label_kh: 'ផ្ទាំងផ្សាយ (Banners)',
          label_en: 'Banner Ads',
          icon: ImageIcon,
          badge: banners.length > 0 ? `${banners.length}` : null,
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        }
      ]
    },
    {
      title: lang === 'km' ? 'ការកំណត់' : 'SETTINGS',
      items: [
        {
          id: 'settings',
          path: '/admin/settings',
          label_kh: 'ការកំណត់ប្រព័ន្ធ',
          label_en: 'System Settings',
          icon: Settings,
          badge: null
        }
      ]
    }
  ];

  const renderContent = (isMobile = false, isCollapsed = false) => (
    <div className="flex flex-col justify-between h-full overflow-hidden">
      <div>
        {/* Brand Header */}
        <div className={`p-4 border-b border-slate-800/80 flex items-center ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}>
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-emerald-500/40 bg-white p-0.5 flex-shrink-0 shadow-md shadow-emerald-500/10">
              <img src={v8Logo} alt="V8 Mart" className="w-full h-full object-contain" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h2 className="text-sm font-black text-white tracking-tight truncate">V8 ONLINE MART</h2>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                </div>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />
                  <span>Admin Portal</span>
                </p>
              </div>
            )}
          </div>

          {/* Close Button on Mobile Drawer */}
          {isMobile ? (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            /* Desktop Collapse Button */
            <button
              onClick={onToggleDesktopCollapse}
              className="hidden lg:flex p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title={isCollapsed ? 'Expand Sidebar' : 'Hide / Collapse Sidebar'}
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4 text-emerald-400" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="p-2 sm:p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-190px)] scrollbar-none">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const label = lang === 'km' ? item.label_kh : item.label_en;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id, item.path);
                      if (isMobile) onClose();
                    }}
                    title={isCollapsed ? label : undefined}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3.5 py-2.5'
                    } rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-transparent text-emerald-400 border border-emerald-500/25 shadow-xs'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} min-w-0 relative`}>
                      <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`} />
                      {!isCollapsed && (
                        <span className="truncate">{label}</span>
                      )}
                      {/* Mini badge indicator in collapsed mode */}
                      {isCollapsed && item.badge && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      )}
                    </div>

                    {!isCollapsed && (
                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                        {item.badge && (
                          <span className={`px-2 py-0.5 text-[10px] font-black rounded-full shadow-xs ${item.badgeColor || 'bg-emerald-500 text-white'}`}>
                            {item.badge}
                          </span>
                        )}
                        {isActive && (
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Store view & Logout */}
      <div className="p-3 border-t border-slate-800/80 space-y-2 bg-slate-950/60">
        <button
          onClick={() => {
            const baseUrl = import.meta.env.BASE_URL || '/';
            window.location.href = baseUrl;
          }}
          title={lang === 'km' ? 'ទំព័រដើមហាង (Storefront)' : 'Live Storefront'}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center p-2' : 'justify-between py-2 px-3'
          } bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition group cursor-pointer`}
        >
          <div className="flex items-center space-x-2">
            <Store className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            {!isCollapsed && <span>{lang === 'km' ? 'ទំព័រដើមហាង' : 'Storefront'}</span>}
          </div>
          {!isCollapsed && <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />}
        </button>

        <button
          onClick={adminLogout}
          title={lang === 'km' ? 'ចាកចេញពី Admin (Logout)' : 'Logout'}
          className={`w-full flex items-center justify-center space-x-2 py-2 ${
            isCollapsed ? 'px-2' : 'px-3'
          } bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 rounded-xl text-xs font-semibold transition cursor-pointer`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>{lang === 'km' ? 'ចាកចេញ' : 'Logout'}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Sidebar (HIDDEN ON MOBILE < 1024px!) */}
      {/* Expands or collapses on desktop */}
      <aside className={`hidden lg:flex ${
        isDesktopCollapsed ? 'w-20' : 'w-64 xl:w-72'
      } bg-slate-950/95 border-r border-slate-800/80 flex-col justify-between h-screen sticky top-0 text-slate-100 z-30 select-none backdrop-blur-xl transition-all duration-300 flex-shrink-0`}>
        {renderContent(false, isDesktopCollapsed)}
      </aside>

      {/* 2. Mobile Slide-Over Drawer (< lg screens: Phones & Small Tablets) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay - tap to hide */}
          <div 
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-fade-in"
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <aside className="relative w-72 max-w-[85vw] bg-slate-950 border-r border-slate-800 text-slate-100 h-full flex flex-col justify-between shadow-2xl z-10 animate-slide-right select-none">
            {renderContent(true, false)}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
