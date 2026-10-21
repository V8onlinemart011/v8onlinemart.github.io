import { readDatabase, writeDatabase, formatProduct } from '../config/database.js';

/**
 * Controller for Guest / Public Client APIs
 */

// 1. GET /products: Fetch active products with category filter, search & pagination
export const getProducts = (req, res) => {
  try {
    const db = readDatabase();
    let products = (db.products || [])
      .filter(p => p.is_active !== false)
      .map(formatProduct);

    const { category, search, page = 1, limit = 50 } = req.query;

    // Filter by Category
    if (category && category !== 'all') {
      const catLower = String(category).toLowerCase();
      products = products.filter(p => 
        String(p.category_id || '').toLowerCase() === catLower ||
        String(p.category || '').toLowerCase().includes(catLower)
      );
    }

    // Filter by Search Keyword
    if (search && String(search).trim() !== '') {
      const q = String(search).toLowerCase().trim();
      products = products.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.title_kh && p.title_kh.toLowerCase().includes(q)) ||
        (p.title_en && p.title_en.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.barcode && p.barcode.toLowerCase().includes(q))
      );
    }

    const total = products.length;
    const pageNum = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, parseInt(limit));
    const startIndex = (pageNum - 1) * pageSize;
    const paginatedProducts = products.slice(startIndex, startIndex + pageSize);

    res.json({
      success: true,
      count: paginatedProducts.length,
      total,
      page: pageNum,
      limit: pageSize,
      data: paginatedProducts
    });
  } catch (err) {
    console.error('Error fetching guest products:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. GET /products/:id: Fetch single product by ID
export const getProductById = (req, res) => {
  try {
    const db = readDatabase();
    const product = (db.products || []).find(p => String(p.id) === String(req.params.id));

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({
      success: true,
      data: formatProduct(product)
    });
  } catch (err) {
    console.error('Error fetching guest product details:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. GET /categories: Fetch categories
export const getCategories = (req, res) => {
  try {
    const db = readDatabase();
    res.json({
      success: true,
      data: db.categories || []
    });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4. POST /orders: Submit new customer order & auto-deduct stock
export const createOrder = (req, res) => {
  try {
    const db = readDatabase();
    const { 
      items = [], 
      customer_name, 
      phone, 
      address, 
      total_amount, 
      currency = 'KHR', 
      payment_method = 'cod',
      telegram_user = null
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Order must contain at least 1 item' });
    }

    // Generate unique Order ID
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    // Verify and deduct stock from database
    const products = db.products || [];
    const stockMovements = db.stock_movements || [];

    for (const item of items) {
      const prodIndex = products.findIndex(p => String(p.id) === String(item.id || item.product_id));
      if (prodIndex !== -1) {
        const currentStock = products[prodIndex].stock_quantity || 0;
        const qty = item.quantity || 1;
        products[prodIndex].stock_quantity = Math.max(0, currentStock - qty);

        // Record stock-out movement
        stockMovements.push({
          id: `MOV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          product_id: products[prodIndex].id,
          product_name: products[prodIndex].name || products[prodIndex].title_kh,
          type: 'stock_out',
          quantity: qty,
          reason: `Guest order ${orderId}`,
          created_at: now
        });
      }
    }

    const newOrder = {
      id: orderId,
      customer_name: customer_name || 'Guest Customer',
      phone: phone || '',
      address: address || '',
      items,
      total_amount: Number(total_amount) || 0,
      currency,
      payment_method,
      status: 'pending', // pending -> preparing -> delivering -> delivered
      telegram_user,
      created_at: now,
      updated_at: now
    };

    db.orders = [newOrder, ...(db.orders || [])];
    db.products = products;
    db.stock_movements = stockMovements;

    writeDatabase(db);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: newOrder
    });
  } catch (err) {
    console.error('Error placing guest order:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 5. GET /orders/:id: Track order status
export const trackOrder = (req, res) => {
  try {
    const db = readDatabase();
    const order = (db.orders || []).find(o => String(o.id) === String(req.params.id));

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (err) {
    console.error('Error tracking order:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 6. GET /health: Health check
export const checkHealth = (req, res) => {
  res.json({
    status: 'ok',
    service: 'V8 Mini Mart Guest API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
};
