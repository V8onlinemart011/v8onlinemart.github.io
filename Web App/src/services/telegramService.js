/**
 * Telegram WebApp SDK Service
 * Handles Telegram Mini App initialization, user profile retrieval, full screen expand, and Admin check.
 */

export const getTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};

export const initTelegramWebApp = () => {
  const tg = getTelegramWebApp();
  if (tg) {
    try {
      tg.ready();
      tg.expand();
      if (tg.enableClosingConfirmation) {
        tg.enableClosingConfirmation();
      }
    } catch (e) {
      console.warn('Telegram WebApp init warning:', e);
    }

    const user = tg.initDataUnsafe?.user || null;
    return {
      isAvailable: true,
      user,
      userId: user?.id || null,
      username: user?.username || '',
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      photoUrl: user?.photo_url || '',
      queryId: tg.initDataUnsafe?.query_id || '',
      colorScheme: tg.colorScheme || 'light',
      platform: tg.platform || 'unknown'
    };
  }

  return {
    isAvailable: false,
    user: null,
    userId: null,
    username: '',
    firstName: '',
    lastName: '',
    photoUrl: '',
    queryId: '',
    colorScheme: 'light',
    platform: 'web'
  };
};

export const isTelegramAdminUser = (telegramUserId, adminIds = ['123456789', 'admin', '81']) => {
  if (!telegramUserId) return false;
  const strId = String(telegramUserId).trim();
  return adminIds.map(id => String(id).trim()).includes(strId);
};
