const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { 
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder 
} = require('../controllers/orderController');

// Đảm bảo route handlers là các hàm
router.post('/', authMiddleware, createOrder);
router.get('/history', authMiddleware, getUserOrders);
router.get('/:orderId', authMiddleware, getOrderById);
router.put('/:orderId/status', authMiddleware, updateOrderStatus);
router.put('/:orderId/cancel', authMiddleware, cancelOrder);

module.exports = router;
