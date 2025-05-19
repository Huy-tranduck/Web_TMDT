const { Order, User } = require('../models/models');

const createOrder = async (req, res) => {
    try {
        const { products, totalAmount, shippingMethod, paymentMethod, voucher } = req.body;
        const userId = req.user.id;

        // Validate required fields
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Danh sách sản phẩm không hợp lệ'
            });
        }

        if (!totalAmount || !shippingMethod || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Create new order
        const order = await Order.create({
            userId,
            products: products.map(p => ({
                productId: p.productId,
                quantity: p.quantity,
                price: parseFloat(p.price),
                name: p.name,
                img: p.img
            })),
            totalAmount,
            shippingMethod,
            paymentMethod,
            voucher,
            status: 'pending'
        });

        // Get list of product IDs to remove from cart
        const productIdsToRemove = products.map(p => p.productId);

        // Update user's cart by removing only ordered products
        await User.findByIdAndUpdate(
            userId,
            { $pull: { cart: { productId: { $in: productIdsToRemove } } } }
        );

        res.status(201).json({ 
            success: true, 
            orderId: order._id 
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.json({ 
            success: true,
            orders 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user is authorized to view this order
        if (order.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById
};
