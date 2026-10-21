import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../../../components/common/Header';
import { SideDrawer } from '../../../components/common/SideDrawer';
import { MobileBottomNav } from '../../../components/common/MobileBottomNav';
import { WishlistModal } from '../../../components/storefront/WishlistModal';
import { Toast } from '../../../components/common/Toast';
import { initTelegramWebApp } from '../../../services/telegramService';

export const ClientLayout = () => {
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    // 1. Initialize Telegram WebApp SDK for full screen, user retrieval, and theme params
    const tgInfo = initTelegramWebApp();
    if (tgInfo.isAvailable && tgInfo.user) {
      console.log('Telegram Mini App active for user:', tgInfo.user.first_name, tgInfo.user.id);
    }

    // 2. Custom listener for wishlist trigger
    const handleOpenWishlist = () => setIsWishlistOpen(true);
    window.addEventListener('open-wishlist', handleOpenWishlist);
    return () => window.removeEventListener('open-wishlist', handleOpenWishlist);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans pb-16 md:pb-0 w-full max-w-full overflow-x-hidden transition-colors duration-300">
      {/* Client Header */}
      <Header />

      {/* Side Navigation Drawer */}
      <SideDrawer />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden content-scalable">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onOpenWishlist={() => setIsWishlistOpen(true)} />

      {/* Modals & Toast */}
      <WishlistModal 
        isOpen={isWishlistOpen} 
        onClose={() => setIsWishlistOpen(false)} 
      />
      <Toast />
    </div>
  );
};
