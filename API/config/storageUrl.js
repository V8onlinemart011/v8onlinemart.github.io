/**
 * Storage URL Configuration & Image Resolver
 * 
 * The API server DOES NOT store images on disk.
 * Instead, all product images and assets are resolved directly from
 * Cloud Storage (Cloudinary CDN or Web App Cloud Storage website).
 */

// Default Web App Cloud Storage URL (e.g. GitHub Pages or Cloudflare Pages)
const DEFAULT_WEB_APP_URL = 'https://v8onlinemart011.github.io/v8onlinemart.github.io';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80';

export const getWebAppStorageUrl = () => {
  const envUrl = process.env.WEB_APP_STORAGE_URL || process.env.WEB_APP_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return DEFAULT_WEB_APP_URL;
};

/**
 * Resolves an image URL so guests and admin always see images loaded from Cloud Storage.
 * - If already a Cloudinary / HTTPS URL, returns as-is.
 * - If a relative path from the Web App (e.g. '/image prodacts/...'), prepends Web App Storage URL.
 */
export const resolveStorageImageUrl = (url) => {
  if (!url || typeof url !== 'string') return FALLBACK_IMAGE;

  const trimmed = url.trim();
  if (!trimmed) return FALLBACK_IMAGE;

  // Already a full Cloud Storage URL (Cloudinary, S3, Unsplash) or Data URL
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Relative path referencing assets stored in Web App Cloud Storage
  const storageBase = getWebAppStorageUrl();
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${storageBase}${cleanPath}`;
};
