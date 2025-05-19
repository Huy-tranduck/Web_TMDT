const { User, Product, Order } = require('../models/models');

// Dashboard stats
const getDashboardStats = async (req, res) => {
    try {
        // Tính tổng số đơn hàng và doanh thu từ collection Orders
        const orders = await Order.find({});
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        
        const stats = {
            totalUsers: await User.countDocuments({ role: 'user' }),
            totalProducts: await Product.countDocuments(),
            totalOrders: orders.length,
            totalRevenue: totalRevenue
        };
        
        res.json(stats);
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Order stats
const getOrderStats = async (req, res) => {
    try {
        // Thêm error handling chi tiết hơn
        const totalOrders = await Order.countDocuments();
        if (totalOrders === undefined) {
            throw new Error('Cannot get total orders');
        }

        const result = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" },
                    pendingOrders: {
                        $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
                    },
                    confirmedOrders: {
                        $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] }
                    },
                    shippingOrders: {
                        $sum: { $cond: [{ $eq: ["$status", "shipping"] }, 1, 0] }
                    },
                    deliveredOrders: {
                        $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] }
                    },
                    cancelledOrders: {
                        $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] }
                    }
                }
            }
        ]);

        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'username')
            .lean();

        if (!recentOrders) {
            throw new Error('Cannot get recent orders');
        }

        const stats = {
            totalOrders,
            totalRevenue: result[0]?.totalRevenue || 0,
            ordersByStatus: {
                pending: result[0]?.pendingOrders || 0,
                confirmed: result[0]?.confirmedOrders || 0,
                shipping: result[0]?.shippingOrders || 0,
                delivered: result[0]?.deliveredOrders || 0,
                cancelled: result[0]?.cancelledOrders || 0
            },
            recentOrders: recentOrders.map(order => ({
                id: order._id,
                customerName: order.userId?.username || 'Unknown',
                totalAmount: order.totalAmount,
                status: order.status,
                date: order.createdAt
            }))
        };

        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Error in getOrderStats:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

// User Management
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Product Management 
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Order Management
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'username email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getOrderStats,
    getUsers,
    updateUser,
    deleteUser,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllOrders,
    updateOrderStatus
};
