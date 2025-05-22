const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/authAdmin');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
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

const {
    getAllBanners,
    createBanner,
    updateBanner,
    deleteBanner
} = require('../controllers/adminController');

// Cập nhật cấu hình multer cho upload banner

// Cấu hình multer để upload hình ảnh banner
const bannerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Đường dẫn tới thư mục client/public/images/banners
        cb(null, path.join(__dirname, '../../client/public/images/banners'));
    },
    filename: (req, file, cb) => {
        cb(null, `banner-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const uploadBanner = multer({
    storage: bannerStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn file 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Chỉ cho phép ảnh: jpg, jpeg, png, gif'));
        }
    }
});

const {
    getVouchers,
    createVoucher, 
    updateVoucher,
    deleteVoucher
} = require('../controllers/voucherController');

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

// Banner routes
router.get('/banners', adminAuth, getAllBanners);
router.post('/banners', adminAuth, uploadBanner.single('image'), createBanner);
router.put('/banners/:id', adminAuth, uploadBanner.single('image'), updateBanner);
router.delete('/banners/:id', adminAuth, deleteBanner);
// Voucher routes 
router.get('/vouchers', adminAuth, getVouchers);
router.post('/vouchers', adminAuth, createVoucher);
router.put('/vouchers/:id', adminAuth, updateVoucher);
router.delete('/vouchers/:id', adminAuth, deleteVoucher);

module.exports = router;
