const express = require('express');
const router = express.Router();
const { 
    addToCart, 
    getCart, 
    decreaseQuantity, // Đổi tên từ removeFromCart
    removeItem, // Đổi tên từ updateCartQuantity 
    removeSelectedItems // Thêm mới
} = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getCart);
router.post('/add', authMiddleware, addToCart);
router.delete('/decrease', authMiddleware, decreaseQuantity);
router.delete('/remove', authMiddleware, removeItem);
router.delete('/selected', authMiddleware, removeSelectedItems);

module.exports = router;