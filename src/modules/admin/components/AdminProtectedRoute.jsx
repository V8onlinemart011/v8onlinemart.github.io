import React from 'react';
import { useStore } from '../../../context/StoreContext';
import { LoginPage } from '../pages/LoginPage';
import { initTelegramWebApp, isTelegramAdminUser } from '../../../services/telegramService';

export const AdminProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated } = useStore();

  // 1. Check direct Admin PIN state
  if (isAdminAuthenticated) {
    return children;
  }

  // 2. Check Telegram WebApp User ID if launched inside Telegram Mini App
  const tg = initTelegramWebApp();
  if (tg.isAvailable && tg.userId) {
    const isTgAdmin = isTelegramAdminUser(tg.userId);
    if (isTgAdmin) {
      return children;
    }
  }

  // Otherwise render Admin Login Page
  return <LoginPage />;
};
