import express from 'express';
import multer from 'multer';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  uploadProductImage,
  getStockMovements,
  getDashboardSummary
} from './adminController.js';

const router = express.Router();

// Memory-only storage for Multer (NEVER writes to disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

// Admin Product Management
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Admin Order Management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Admin Direct Cloud Storage Image Upload
router.post('/upload', upload.single('image'), uploadProductImage);

// Admin Analytics & Stock
router.get('/stock-movements', getStockMovements);
router.get('/dashboard', getDashboardSummary);

export default router;
