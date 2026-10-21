import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './AdminHeader';
import { Toast } from '../../../components/common/Toast';
import { useStore } from '../../../context/StoreContext';
import { NotificationManagement } from '../../../components/admin/NotificationManagement';

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fontSize } = useStore();

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
  };

  const activeTab = getActiveTab();

  return (
    <div className={`min-h-screen bg-slate-950 font-sans text-slate-100 flex w-full max-w-full overflow-x-hidden font-size-${fontSize || 'normal'}`}>
      {/* 1. Desktop & Tablet Navigation Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AdminHeader title="V8 MERCHANT ADMIN PORTAL" />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>

        <NotificationManagement />
        <Toast />
      </div>
    </div>
  );
};

export default AdminLayout;
