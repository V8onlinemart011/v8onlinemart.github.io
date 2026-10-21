/**
 * V8 Mini Mart REST API Client Service
 * Connects Client WebApp & Web Admin Dashboard with Express Backend Server
 */
// Dynamic API Base URL resolution for local dev & cloud production hosting
const getApiBaseUrl = () => {
  const envUrl = (import.meta.env?.VITE_API_BASE_URL || '').trim();
  if (!envUrl) return 'http://localhost:5000/api';
  const cleanUrl = envUrl.replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const API_BASE_URL = getApiBaseUrl();

// Helper for HTTP requests
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const json = await res.json();
    if (!res.ok || json.success === false) {
      throw new Error(json.error || `API error: ${res.status}`);
    }
    return json;
  } catch (err) {
    console.error(`API Request Error [${endpoint}]:`, err);
    throw err;
  }
};

// ==========================================
// 1. PUBLIC APIS (Client WebApp / Telegram)
// ==========================================

/**
 * GET /api/products
 * Fetch product list with optional category filter, search keyword, and pagination.
 */
export const getProducts = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'all') query.append('category', params.category);
  if (params.search) query.append('search', params.search);
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return await request(`/products${queryString}`);
};

/**
 * GET /api/products/:id
 * Fetch single product details by ID.
 */
export const getProductById = async (id) => {
  return await request(`/products/${id}`);
};

/**
 * POST /api/orders
 * Submit new order from Telegram WebApp. Auto-deducts product stock in backend DB.
 */
export const createOrder = async (orderData) => {
  return await request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
};

// ==========================================
// 2. ADMIN APIS (Web Admin Dashboard)
// ==========================================

/**
 * POST /api/admin/products
 * Create a new product.
 */
export const createProduct = async (productData) => {
  return await request('/admin/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  });
};

/**
 * PUT /api/admin/products/:id
 * Update product details and adjust stock quantity (Stock In / Stock Out).
 */
export const updateProduct = async (id, updateData) => {
  return await request(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
};

/**
 * DELETE /api/admin/products/:id
 * Delete product from stock database.
 */
export const deleteProduct = async (id) => {
  return await request(`/admin/products/${id}`, {
    method: 'DELETE'
  });
};

/**
 * POST /api/admin/upload
 * Upload product image to storage and return image URL.
 */
export const uploadProductImage = async (fileOrBase64) => {
  if (typeof fileOrBase64 === 'string') {
    // Base64 string payload
    return await request('/admin/upload', {
      method: 'POST',
      body: JSON.stringify({ imageBase64: fileOrBase64 })
    });
  }

  // File payload (FormData)
  const formData = new FormData();
  formData.append('image', fileOrBase64);

  const res = await fetch(`${API_BASE_URL}/admin/upload`, {
    method: 'POST',
    body: formData
  });

  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.error || 'Failed to upload image');
  }
  return json;
};

export default {
  getProducts,
  getProductById,
  createOrder,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
};
