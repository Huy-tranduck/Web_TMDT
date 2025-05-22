const Voucher = require('../models/Voucher');

// Get all vouchers
exports.getVouchers = async (req, res) => {
    try {
        const vouchers = await Voucher.find().sort({ createdAt: -1 });
        res.json({ success: true, vouchers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create voucher
exports.createVoucher = async (req, res) => {
    try {
        const newVoucher = new Voucher(req.body);
        await newVoucher.save();
        res.status(201).json({ success: true, voucher: newVoucher });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update voucher
exports.updateVoucher = async (req, res) => {
    try {
        const voucher = await Voucher.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!voucher) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy voucher' 
            });
        }
        res.json({ success: true, voucher });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete voucher
exports.deleteVoucher = async (req, res) => {
    try {
        const voucher = await Voucher.findByIdAndDelete(req.params.id);
        if (!voucher) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy voucher'
            });
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Validate voucher
exports.validateVoucher = async (req, res) => {
    try {
        const { code, totalAmount } = req.body;
        
        // Sửa lại điều kiện tìm kiếm voucher hợp lệ
        const voucher = await Voucher.findOne({
            code,
            isActive: true,
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() },
            $expr: { $gt: ["$quantity", "$usedCount"] } // Sửa lại cách so sánh quantity và usedCount
        });

        if (!voucher) {
            return res.json({ 
                success: false, 
                message: 'Voucher không hợp lệ hoặc đã hết hạn' 
            });
        }

        if (totalAmount < voucher.minSpend) {
            return res.json({ 
                success: false, 
                message: `Đơn hàng tối thiểu ${voucher.minSpend.toLocaleString('vi-VN')}₫`
            });
        }

        res.json({
            success: true,
            voucher: {
                code: voucher.code,
                discountAmount: voucher.discountAmount,
                description: voucher.description
            }
        });

    } catch (error) {
        console.error('Validate voucher error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
