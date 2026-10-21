import imageCompression from 'browser-image-compression';
import { formatBytes } from '../utils/imageCompressor';

/**
 * Compresses an image file using browser-image-compression,
 * converts it to WebP format under 150KB - 200KB,
 * and reports compression progress.
 *
 * @param {File} file 
 * @param {Object} options 
 * @param {Function} onProgress 
 * @returns {Promise<{ file: File, base64: string, previewUrl: string, originalSize: number, compressedSize: number, ratio: number, originalFormatted: string, compressedFormatted: string }>}
 */
export const processImageFile = async (file, targetSizeKB = 150, onProgress = null) => {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file');
  }

  const originalSize = file.size;

  // Options for browser-image-compression targeting WebP format < 150KB
  const options = {
    maxSizeMB: targetSizeKB / 1024, // e.g. 0.15 MB (150KB)
    maxWidthOrHeight: 800,
    useWebWorker: true,
    fileType: 'image/webp',
    onProgress: (percent) => {
      if (onProgress && typeof onProgress === 'function') {
        onProgress(Math.min(90, Math.round(percent)));
      }
    }
  };

  let compressedFile;
  try {
    compressedFile = await imageCompression(file, options);
  } catch (err) {
    console.warn('browser-image-compression fallback to default file:', err);
    compressedFile = file;
  }

  // Generate Base64 and WebP Data URL
  const base64 = await imageCompression.getDataUrlFromFile(compressedFile);
  const compressedSize = compressedFile.size;
  const ratio = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

  if (onProgress) onProgress(100);

  return {
    file: compressedFile,
    base64,
    previewUrl: base64,
    originalSize,
    compressedSize,
    ratio,
    originalFormatted: formatBytes(originalSize),
    compressedFormatted: formatBytes(compressedSize)
  };
};

export { formatBytes };
