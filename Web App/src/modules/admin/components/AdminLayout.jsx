import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './AdminHeader';
import { Toast } from '../../../components/common/Toast';
import { useStore } from '../../../context/StoreContext';
import { NotificationManagement } from '../../../components/admin/NotificationManagement';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingCart, 
  Menu
} from 'lucide-react';

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fontSize, lowStockProducts, orders, lang } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(() => {
    try {
      return localStorage.getItem('v8_admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleDesktopSidebar = () => {
    setIsDesktopCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('v8_admin_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Auto-close mobile drawer on route navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/admin/inventory')) return 'inventory';
    if (path.includes('/admin/add-product')) return 'add-product';
    if (path.includes('/admin/orders')) return 'orders';
    if (path.includes('/admin/banners')) return 'banners';
    if (path.includes('/admin/settings')) return 'settings';
    return 'overview';
  };

  const handleTabChange = (tabId, path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const activeTab = getActiveTab();
  const lowStockCount = lowStockProducts?.length || 0;
  const pendingOrdersCount = orders?.filter(o => o.status === 'pending').length || 0;

  // Bottom Navigation Items for Mobile/Tablet (< 1024px)
  const bottomNavItems = [
    {
      id: 'overview',
      path: '/admin',
      label: lang === 'km' ? 'ទិដ្ឋភាព' : 'Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'inventory',
      path: '/admin/inventory',
      label: lang === 'km' ? 'ស្តុក' : 'Stock',
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : null,
      badgeColor: 'bg-rose-500'
    },
    {
      id: 'add-product',
      path: '/admin/add-product',
      label: lang === 'km' ? 'បន្ថែម' : 'Add',
      icon: PlusCircle,
      isPrimaryAction: true
    },
    {
      id: 'orders',
      path: '/admin/orders',
      label: lang === 'km' ? 'ការកុម្ម៉ង់' : 'Orders',
      icon: ShoppingCart,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
      badgeColor: 'bg-orange-500'
    },
    {
      id: 'menu',
      path: null,
      label: lang === 'km' ? 'ម៉ឺនុយ' : 'Menu',
      icon: Menu,
      isMenuToggle: true
    }
  ];

  return (
    <div className={`min-h-screen bg-slate-950 font-sans text-slate-100 flex w-full max-w-full overflow-x-hidden font-size-${fontSize || 'normal'} relative selection:bg-emerald-500 selection:text-white`}>
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      {/* 1. Desktop Sidebar & Mobile Slide-Over Drawer */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isDesktopCollapsed={isDesktopCollapsed}
        onToggleDesktopCollapse={toggleDesktopSidebar}
      />

      {/* 2. Main Content Area (Expands to 100% Full Width on Mobile!) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen z-10 transition-all duration-300">
        <AdminHeader 
          title="V8 Admin Portal" 
          activeTab={activeTab}
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
          isDesktopCollapsed={isDesktopCollapsed}
          onToggleDesktopCollapse={toggleDesktopSidebar}
        />

        {/* Content Container - 100% full width on mobile for maximum spaciousness */}
        <main className="flex-1 p-3 sm:p-5 lg:p-7 max-w-7xl w-full mx-auto space-y-4 sm:space-y-6 pb-24 lg:pb-12">
          <Outlet />
        </main>

        <NotificationManagement />
        <Toast />
      </div>

      {/* 3. Mobile Bottom Navigation Bar (Phones & Small Tablets < 1024px) */}
      <nav 
        aria-label="Admin mobile navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom"
      >
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isPrimaryAction) {
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id, item.path)}
                className="flex flex-col items-center justify-center -mt-5 relative group cursor-pointer"
                title={item.label}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                  isActive 
                    ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-emerald-500/30' 
                    : 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/25 hover:scale-105'
                }`}>
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-emerald-400 mt-1">{item.label}</span>
              </button>
            );
          }

          if (item.isMenuToggle) {
            return (
              <button
                key={item.id}
                onClick={() => setIsMobileMenuOpen(true)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer ${
                  isMobileMenuOpen ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Open Full Menu"
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id, item.path)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition relative cursor-pointer ${
                isActive 
                  ? 'text-emerald-400 font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 mb-0.5 transition ${isActive ? 'stroke-[2.5]' : ''}`} />
                {item.badge && (
                  <span className={`absolute -top-1 -right-2.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-black text-white flex items-center justify-center shadow-xs ${item.badgeColor || 'bg-rose-500'}`}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminLayout;
