const express = require('express');
const router = express.Router();
const authAdmin = require('../middleware/authAdmin');
const {
    getVouchers,
    createVoucher,
    updateVoucher,
    deleteVoucher,
    validateVoucher
} = require('../controllers/voucherController');

// Admin routes
router.get('/admin', authAdmin, getVouchers);
router.post('/admin', authAdmin, createVoucher);
router.put('/admin/:id', authAdmin, updateVoucher);
router.delete('/admin/:id', authAdmin, deleteVoucher);

// User routes
router.post('/validate', validateVoucher);

module.exports = router;
