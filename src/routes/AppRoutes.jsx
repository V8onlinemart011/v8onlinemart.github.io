import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Client WebApp Modules
import { ClientLayout } from '../modules/client/components/ClientLayout';
import { HomePage } from '../modules/client/pages/HomePage';
import { CartPage } from '../modules/client/pages/CartPage';
import { ProductDetailPage } from '../modules/client/pages/ProductDetailPage';

// Admin Dashboard Modules
import { AdminProtectedRoute } from '../modules/admin/components/AdminProtectedRoute';
import { AdminLayout } from '../modules/admin/components/AdminLayout';
import { DashboardPage } from '../modules/admin/pages/DashboardPage';
import { InventoryPage } from '../modules/admin/pages/InventoryPage';
import { AddProductPage } from '../modules/admin/pages/AddProductPage';
import { SettingsPage } from '../modules/admin/pages/SettingsPage';
import { LoginPage } from '../modules/admin/pages/LoginPage';

// Admin Feature Components
import { OrderManagement } from '../components/admin/OrderManagement';
import { BannerManagement } from '../components/admin/BannerManagement';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Client WebApp (Storefront & Telegram Mini App) */}
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<HomePage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
      </Route>

      {/* 2. Admin Dashboard (Protected Admin Portal) */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="add-product" element={<AddProductPage />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="banners" element={<BannerManagement />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
