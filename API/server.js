import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Import Guest & Admin Routes
import guestRoutes from './guest/guestRoutes.js';
import adminRoutes from './admin/adminRoutes.js';
import { getWebAppStorageUrl } from './config/storageUrl.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable configurable CORS
const allowedOrigins = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: allowedOrigins === '*' ? '*' : allowedOrigins.split(',').map(s => s.trim()),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 1. Mount Guest APIs
app.use('/api/guest', guestRoutes);

// 2. Mount Admin APIs
app.use('/api/admin', adminRoutes);

// 3. Backwards-compatible aliases for client storefront
app.use('/api', guestRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'V8 Mini Mart Modular API Server',
    guest_api: '/api/guest',
    admin_api: '/api/admin',
    cloud_storage_url: getWebAppStorageUrl(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Interactive Public Landing Page for Guests & Admin
app.get('/', (req, res) => {
  const storageUrl = getWebAppStorageUrl();
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>V8 Mini Mart REST API Server</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; margin: 0; line-height: 1.5; }
        .container { max-width: 800px; margin: 20px auto; }
        .header { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 24px 32px; margin-bottom: 24px; }
        .badge { background: #10b981; color: white; padding: 3px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 20px; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 24px; }
        h1 { margin: 0 0 10px 0; color: #38bdf8; font-size: 24px; }
        h2 { margin: 0 0 16px 0; font-size: 18px; display: flex; align-items: center; gap: 8px; }
        .guest-title { color: #34d399; }
        .admin-title { color: #f59e0b; }
        ul { list-style: none; padding: 0; margin: 0; }
        li { background: #0f172a; margin: 8px 0; padding: 10px 14px; border-radius: 8px; border: 1px solid #334155; font-size: 13px; }
        a { color: #38bdf8; text-decoration: none; font-weight: 600; }
        a:hover { text-decoration: underline; }
        .method { padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; font-family: monospace; margin-right: 6px; }
        .get { background: #0284c7; color: white; }
        .post { background: #059669; color: white; }
        .put { background: #d97706; color: white; }
        .delete { background: #dc2626; color: white; }
        .notice { background: #1e1b4b; border: 1px solid #4338ca; padding: 14px 18px; border-radius: 10px; font-size: 13px; color: #c7d2fe; margin-top: 24px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 V8 Mini Mart API Server <span class="badge">ONLINE</span></h1>
          <p style="color: #94a3b8; margin: 4px 0 0 0;">
            Architecture separated into <strong>Guest APIs</strong> (ភ្ញៀវ) and <strong>Admin APIs</strong> (Admin).
          </p>
        </div>

        <div class="grid">
          <!-- Guest Module -->
          <div class="card">
            <h2 class="guest-title">👤 Guest APIs (ភ្ញៀវទូទៅ)</h2>
            <p style="color: #94a3b8; font-size: 13px;">Endpoints for customer storefront and shopping:</p>
            <ul>
              <li><span class="method get">GET</span> <a href="/api/guest/products" target="_blank">/api/guest/products</a> - Products Catalog</li>
              <li><span class="method get">GET</span> <a href="/api/guest/categories" target="_blank">/api/guest/categories</a> - Product Categories</li>
              <li><span class="method post">POST</span> <span style="color: #f1f5f9;">/api/guest/orders</span> - Submit New Order</li>
              <li><span class="method get">GET</span> <span style="color: #f1f5f9;">/api/guest/orders/:id</span> - Track Order Status</li>
              <li><span class="method get">GET</span> <a href="/api/guest/health" target="_blank">/api/guest/health</a> - Guest API Status</li>
            </ul>
          </div>

          <!-- Admin Module -->
          <div class="card">
            <h2 class="admin-title">🔐 Admin APIs (គ្រប់គ្រងហាង)</h2>
            <p style="color: #94a3b8; font-size: 13px;">Endpoints for store management & inventory:</p>
            <ul>
              <li><span class="method get">GET</span> <a href="/api/admin/products" target="_blank">/api/admin/products</a> - Full Inventory List</li>
              <li><span class="method post">POST</span> <span style="color: #f1f5f9;">/api/admin/products</span> - Create Product</li>
              <li><span class="method put">PUT</span> <span style="color: #f1f5f9;">/api/admin/products/:id</span> - Update Stock & Price</li>
              <li><span class="method delete">DEL</span> <span style="color: #f1f5f9;">/api/admin/products/:id</span> - Delete Product</li>
              <li><span class="method get">GET</span> <a href="/api/admin/orders" target="_blank">/api/admin/orders</a> - All Orders</li>
              <li><span class="method post">POST</span> <span style="color: #f1f5f9;">/api/admin/upload</span> - Direct Cloud Storage Upload</li>
              <li><span class="method get">GET</span> <a href="/api/admin/dashboard" target="_blank">/api/admin/dashboard</a> - Sales & Analytics</li>
            </ul>
          </div>
        </div>

        <div class="notice">
          ☁️ <strong>Cloud Storage Notice:</strong> This API server does not store images on disk. Images are resolved and loaded directly from Cloud Storage (Cloudinary CDN or Web App Storage: <code style="color: #a5b4fc;">${storageUrl}</code>).
        </div>
      </div>
    </body>
    </html>
  `);
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 V8 Mini Mart API Server listening on port ${PORT}`);
  console.log(`👤 Guest APIs: http://localhost:${PORT}/api/guest/products`);
  console.log(`🔐 Admin APIs: http://localhost:${PORT}/api/admin/products`);
  console.log(`☁️ Cloud Storage URL: ${getWebAppStorageUrl()}`);
});
