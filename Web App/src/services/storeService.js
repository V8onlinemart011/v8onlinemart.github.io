/**
 * Store Data & LocalStorage Management Service
 */

const STORAGE_KEYS = {
  PRODUCTS: 'v8_products',
  CATEGORIES: 'v8_categories',
  CART: 'v8_cart',
  ORDERS: 'v8_orders',
  MEMBERS: 'v8_members',
  ADMIN_AUTH: 'v8_admin_authenticated',
  SETTINGS: 'v8_settings',
};

export const getStoredData = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
};

export const setStoredData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
};

export const removeStoredData = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`Error removing ${key} from localStorage`, e);
  }
};

export { STORAGE_KEYS };
