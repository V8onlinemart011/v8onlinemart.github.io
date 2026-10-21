import { readDatabase, writeDatabase, formatProduct } from '../config/database.js';
import { uploadImageToCloudStorage } from '../config/cloudinary.js';
import { resolveStorageImageUrl } from '../config/storageUrl.js';

/**
 * Controller for Admin Management Portal APIs
 * 
 * NOTE: The Admin API DOES NOT store images on local disk.
 * All image uploads stream directly to Cloud Storage (Cloudinary).
 */

// 1. GET /products: Fetch all products with full admin details
export const getAllProducts = (req, res) => {
  try {
    const db = readDatabase();
    const products = (db.products || []).map(formatProduct);
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    console.error('Error fetching admin products:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. POST /products: Create new product in inventory
export const createProduct = (req, res) => {
  try {
    const db = readDatabase();
    const newProduct = req.body;

    if (!newProduct.name && !newProduct.title_en && !newProduct.title_kh) {
      return res.status(400).json({ success: false, error: 'Product name or title is required' });
    }

    const productId = newProduct.id || `PRD-${Date.now().toString().slice(-7)}`;
    const now = new Date().toISOString();

    // Map and ensure images point to Cloud Storage
    let productImages = [];
    if (Array.isArray(newProduct.images) && newProduct.images.length > 0) {
      productImages = newProduct.images.map(img => resolveStorageImageUrl(img));
    } else if (newProduct.image_url) {
      productImages = [resolveStorageImageUrl(newProduct.image_url)];
    } else {
      productImages = [resolveStorageImageUrl('/iconv8mart.jpg')];
    }

    const formatted = formatProduct({
      ...newProduct,
      id: productId,
      images: productImages,
      image_url: productImages[0],
      created_at: now
    });

    db.products = [formatted, ...(db.products || [])];

    // Record initial stock movement
    if (formatted.stock_quantity > 0) {
      db.stock_movements = db.stock_movements || [];
      db.stock_movements.push({
        id: `MOV-${Date.now()}`,
        product_id: formatted.id,
        product_name: formatted.name,
        type: 'initial_stock',
        quantity: formatted.stock_quantity,
        reason: 'New product creation',
        created_at: now
      });
    }

    writeDatabase(db);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: formatted
    });
  } catch (err) {
    console.error('Error creating admin product:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. PUT /products/:id: Update product and adjust stock
export const updateProduct = (req, res) => {
  try {
    const db = readDatabase();
    const productId = String(req.params.id);
    const index = (db.products || []).findIndex(p => String(p.id) === productId);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const existingProduct = db.products[index];
    const updateData = req.body;
    const now = new Date().toISOString();

    // Check if stock quantity changed to log stock movement
    if (updateData.stock_quantity !== undefined && Number(updateData.stock_quantity) !== existingProduct.stock_quantity) {
      const diff = Number(updateData.stock_quantity) - (existingProduct.stock_quantity || 0);
      db.stock_movements = db.stock_movements || [];
      db.stock_movements.push({
        id: `MOV-${Date.now()}`,
        product_id: productId,
        product_name: existingProduct.name || existingProduct.title_kh,
        type: diff > 0 ? 'stock_in' : 'stock_out',
        quantity: Math.abs(diff),
        reason: updateData.stock_reason || 'Admin inventory adjustment',
        created_at: now
      });
    }

    // Resolve images to Cloud Storage if provided
    let updatedImages = existingProduct.images;
    if (Array.isArray(updateData.images)) {
      updatedImages = updateData.images.map(img => resolveStorageImageUrl(img));
    } else if (updateData.image_url) {
      updatedImages = [resolveStorageImageUrl(updateData.image_url)];
    }

    const updated = formatProduct({
      ...existingProduct,
      ...updateData,
      id: productId,
      images: updatedImages,
      image_url: updatedImages[0] || existingProduct.image_url,
      updated_at: now
    });

    db.products[index] = updated;
    writeDatabase(db);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updated
    });
  } catch (err) {
    console.error('Error updating admin product:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4. DELETE /products/:id: Delete product from inventory
export const deleteProduct = (req, res) => {
  try {
    const db = readDatabase();
    const productId = String(req.params.id);
    const initialLen = (db.products || []).length;

    db.products = (db.products || []).filter(p => String(p.id) !== productId);

    if (db.products.length === initialLen) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    writeDatabase(db);

    res.json({
      success: true,
      message: `Product ${productId} removed from inventory`
    });
  } catch (err) {
    console.error('Error deleting admin product:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 5. GET /orders: Fetch all orders
export const getAllOrders = (req, res) => {
  try {
    const db = readDatabase();
    res.json({
      success: true,
      count: (db.orders || []).length,
      data: db.orders || []
    });
  } catch (err) {
    console.error('Error fetching admin orders:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 6. PUT /orders/:id/status: Update order status & delivery
export const updateOrderStatus = (req, res) => {
  try {
    const db = readDatabase();
    const orderId = String(req.params.id);
    const { status, delivery_rider, delivery_photo_url } = req.body;

    const index = (db.orders || []).findIndex(o => String(o.id) === orderId);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (status) db.orders[index].status = status;
    if (delivery_rider) db.orders[index].delivery_rider = delivery_rider;
    if (delivery_photo_url) db.orders[index].delivery_photo_url = resolveStorageImageUrl(delivery_photo_url);
    db.orders[index].updated_at = new Date().toISOString();

    writeDatabase(db);

    res.json({
      success: true,
      message: `Order ${orderId} updated to ${status}`,
      data: db.orders[index]
    });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 7. POST /upload: Upload product image directly to Cloudinary (In-Memory, No Disk Storage)
export const uploadProductImage = async (req, res) => {
  try {
    let buffer = null;

    if (req.file && req.file.buffer) {
      buffer = req.file.buffer;
    } else if (req.body && req.body.imageBase64) {
      const b64 = req.body.imageBase64;
      const cleanB64 = b64.includes(',') ? b64.split(',')[1] : b64;
      buffer = Buffer.from(cleanB64, 'base64');
    }

    if (!buffer) {
      return res.status(400).json({ success: false, error: 'No image file or imageBase64 data provided' });
    }

    // Stream directly to Cloudinary Cloud Storage
    const cloudResult = await uploadImageToCloudStorage(buffer, 'v8_mini_mart/products');

    res.json({
      success: true,
      message: 'Image uploaded to Cloud Storage successfully',
      image_url: cloudResult.secure_url,
      public_id: cloudResult.public_id
    });
  } catch (err) {
    console.error('Error in cloud image upload:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 8. GET /stock-movements: Stock movement history log
export const getStockMovements = (req, res) => {
  try {
    const db = readDatabase();
    res.json({
      success: true,
      count: (db.stock_movements || []).length,
      data: (db.stock_movements || []).reverse()
    });
  } catch (err) {
    console.error('Error fetching stock movements:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 9. GET /dashboard: Analytics overview
export const getDashboardSummary = (req, res) => {
  try {
    const db = readDatabase();
    const products = (db.products || []).map(formatProduct);
    const orders = db.orders || [];

    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.stock_quantity <= p.low_stock_threshold).length;
    const outOfStockCount = products.filter(p => p.stock_quantity === 0).length;

    const totalOrders = orders.length;
    const totalSalesKHR = orders.reduce((sum, o) => sum + (o.currency === 'KHR' ? Number(o.total_amount) || 0 : (Number(o.total_amount) || 0) * 4000), 0);

    res.json({
      success: true,
      data: {
        totalProducts,
        lowStockCount,
        outOfStockCount,
        totalOrders,
        totalSalesKHR,
        totalSalesUSD: (totalSalesKHR / 4000).toFixed(2)
      }
    });
  } catch (err) {
    console.error('Error fetching dashboard summary:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
