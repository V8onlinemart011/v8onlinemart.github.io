import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveStorageImageUrl } from './storageUrl.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiDir = path.resolve(__dirname, '..');
const rootDir = path.resolve(apiDir, '..');

// DB directory resolution: checks API/server_data first, then Web App/server_data
const localDbDir = path.join(apiDir, 'server_data');
const webAppDbDir = path.join(rootDir, 'Web App', 'server_data');
const fallbackDbDir = path.join(rootDir, 'server_data');

let resolvedDbDir = localDbDir;
if (fs.existsSync(localDbDir)) {
  resolvedDbDir = localDbDir;
} else if (fs.existsSync(webAppDbDir)) {
  resolvedDbDir = webAppDbDir;
} else if (fs.existsSync(fallbackDbDir)) {
  resolvedDbDir = fallbackDbDir;
}

if (!fs.existsSync(resolvedDbDir)) {
  try {
    fs.mkdirSync(resolvedDbDir, { recursive: true });
  } catch (e) {
    console.warn('Could not create DB dir, using local fallback:', e.message);
  }
}

const dbFile = path.join(resolvedDbDir, 'store_db.json');

/**
 * Read raw database
 */
export const readDatabase = () => {
  // If local db doesn't exist, try loading from Web App server_data
  if (!fs.existsSync(dbFile)) {
    const webAppFile = path.join(webAppDbDir, 'store_db.json');
    if (fs.existsSync(webAppFile)) {
      try {
        const content = fs.readFileSync(webAppFile, 'utf-8');
        return JSON.parse(content);
      } catch (err) {
        console.error('Error reading from Web App store_db.json:', err);
      }
    }
    return { products: [], orders: [], categories: [], stock_movements: [] };
  }

  try {
    const content = fs.readFileSync(dbFile, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading database file:', err);
    return { products: [], orders: [], categories: [], stock_movements: [] };
  }
};

/**
 * Write updated database
 */
export const writeDatabase = (data) => {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database file:', err);
  }
};

/**
 * Formats a product and resolves all images to Cloud Storage / Web App storage URLs
 * Ensures the API never serves dead local paths to guests or admin.
 */
export const formatProduct = (product) => {
  const name = product.name || product.title_en || product.title_kh || 'Product';
  const category = product.category || product.category_name_en || product.category_name_kh || 'General';

  // Map and resolve images to Cloud Storage
  let rawImages = [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    rawImages = product.images;
  } else if (product.image_url) {
    rawImages = [product.image_url];
  } else {
    rawImages = ['/iconv8mart.jpg'];
  }

  const cloudImages = rawImages.map(img => resolveStorageImageUrl(img));
  const mainImageUrl = cloudImages[0];

  return {
    id: String(product.id),
    name,
    category,
    price: Number(product.price) || 0,
    cost_price: Number(product.cost_price) || Math.round((Number(product.price) || 0) * 0.7),
    stock_quantity: Number(product.stock_quantity) || 0,
    image_url: mainImageUrl,
    images: cloudImages,
    low_stock_threshold: Number(product.low_stock_threshold) || 5,
    created_at: product.created_at || new Date().toISOString(),

    // Extra fields for full WebApp / Storefront compatibility
    title_kh: product.title_kh || name,
    title_en: product.title_en || name,
    category_id: product.category_id || 'cat-general',
    category_name_kh: product.category_name_kh || category,
    category_name_en: product.category_name_en || category,
    sku: product.sku || `SKU-${product.id}`,
    barcode: product.barcode || product.sku || `SKU-${product.id}`,
    description_kh: product.description_kh || '',
    description_en: product.description_en || '',
    supplier_name: product.supplier_name || '',
    supplier_contact: product.supplier_contact || '',
    purchase_invoice_no: product.purchase_invoice_no || '',
    expiry_date: product.expiry_date || '',
    mfg_date: product.mfg_date || '',
    batch_no: product.batch_no || '',
    is_active: product.is_active !== false
  };
};
