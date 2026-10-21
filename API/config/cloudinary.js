import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

// Configure Cloudinary Cloud Storage
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
    secure: true
  });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'cfqs7qhd',
    api_key: process.env.CLOUDINARY_API_KEY || '485494854917591',
    api_secret: process.env.CLOUDINARY_API_SECRET || '5eBRBvg3VzRNH4ZOAKk-Z5gl4Tk',
    secure: true
  });
}

/**
 * Uploads an image buffer directly to Cloudinary Cloud Storage in memory.
 * Compresses image with sharp (WebP format, quality 85) before streaming.
 * NEVER saves any file to local disk.
 *
 * @param {Buffer} buffer - Image file buffer
 * @param {string} folder - Cloudinary folder (default: 'v8_mini_mart')
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
export const uploadImageToCloudStorage = async (buffer, folder = 'v8_mini_mart') => {
  // Compress and convert to modern WebP format in memory
  const webpBuffer = await sharp(buffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        format: 'webp'
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    uploadStream.end(webpBuffer);
  });
};

export default cloudinary;
