const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart, updateCartQuantity } = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getCart); // Lấy giỏ hàng
router.post('/add', authMiddleware, addToCart); // Thêm sản phẩm vào giỏ hàng
router.delete('/remove', authMiddleware, removeFromCart); // Xóa sản phẩm khỏi giỏ hàng
router.delete('/update', authMiddleware, updateCartQuantity); // Cập nhật số lượng sản phẩm

module.exports = router;