const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { 
    getProducts,
    getFeaturedProducts,
    getNewProducts,
    getInstallmentProducts,
    getShockingProducts,
    getBigDiscountProducts,
    getCheapProducts,
    searchProducts,
    getProductsByCompany,
    getProductDetail, 
    addReview,
    getReviews
} = require('../controllers/productController');

// Define routes in correct order
router.get('/featured', getFeaturedProducts);
router.get('/new', getNewProducts);
router.get('/installment', getInstallmentProducts);
router.get('/shocking', getShockingProducts);
router.get('/bigdiscount', getBigDiscountProducts);
router.get('/cheap', getCheapProducts);
router.get('/search', searchProducts);
router.get('/company/:company', getProductsByCompany);
router.get('/detail/:id', getProductDetail); // Thay đổi route này
router.get('/', getProducts);
router.post('/:productId/reviews', authMiddleware, addReview); // Thêm đánh giá
router.get('/:productId/reviews', getReviews); // Lấy danh sách đánh giá

module.exports = router;
