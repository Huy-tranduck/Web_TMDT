const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/authAdmin');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const {
    getDashboardStats,
    getUsers,
    updateUser,
    deleteUser,
    getAllProducts,
    createProduct,
    updateProduct, 
    deleteProduct,
    getAllOrders,
    updateOrderStatus,
    getOrderStats,
    createUser,
    resetUserPassword
} = require('../controllers/adminController');

// Dashboard routes
router.get('/stats', adminAuth, getDashboardStats);

// User routes
router.get('/users', adminAuth, getUsers);
router.put('/users/:id', adminAuth, updateUser);
router.delete('/users/:id', adminAuth, deleteUser);

// User management routes
router.post('/users', adminAuth, createUser);
router.post('/users/:userId/reset-password', adminAuth, resetUserPassword);

// Product routes
router.get('/products', adminAuth, getAllProducts);
router.post('/products', adminAuth, createProduct);
router.put('/products/:id', adminAuth, updateProduct);
router.delete('/products/:id', adminAuth, deleteProduct);

// Order routes
router.get('/orders/stats', adminAuth, getOrderStats); // Đặt trước route orders
router.get('/orders', adminAuth, getAllOrders);
router.put('/orders/:id', adminAuth, updateOrderStatus);

module.exports = router;
