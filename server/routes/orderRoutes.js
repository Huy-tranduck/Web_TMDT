const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { 
    createOrder,
    getUserOrders,
    getOrderById
} = require('../controllers/orderController');

// Order routes
router.post('/', authMiddleware, createOrder);
router.get('/user', authMiddleware, getUserOrders);
router.get('/:id', authMiddleware, getOrderById);

module.exports = router;
