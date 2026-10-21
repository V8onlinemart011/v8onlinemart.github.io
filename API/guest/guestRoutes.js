import express from 'express';
import {
  getProducts,
  getProductById,
  getCategories,
  createOrder,
  trackOrder,
  checkHealth
} from './guestController.js';

const router = express.Router();

// Guest Public Routes
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/categories', getCategories);
router.post('/orders', createOrder);
router.get('/orders/:id', trackOrder);
router.get('/health', checkHealth);

export default router;
