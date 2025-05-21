const { User, Product, Order } = require('../models/models');
const bcrypt = require('bcryptjs');

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

// Thêm mới người dùng
const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Kiểm tra username và email đã tồn tại
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username hoặc email đã tồn tại'
            });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'user',
            cart: [],
            isActive: true
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'Tạo người dùng thành công',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo người dùng',
            error: error.message
        });
    }
};

// Đặt lại mật khẩu
const resetUserPassword = async (req, res) => {
    try {
        const { userId } = req.params;
        const defaultPassword = '123456'; // Mật khẩu mặc định
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const user = await User.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        res.json({
            success: true,
            message: 'Đặt lại mật khẩu thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi đặt lại mật khẩu',
            error: error.message
        });
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
    const productData = req.body;

    // Validate required fields
    if (!productData.name || !productData.price || !productData.masp) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin sản phẩm bắt buộc'
      });
    }

    // Create new product with mongoose
    const newProduct = new Product({
      name: productData.name,
      company: productData.company,
      img: productData.img,
      price: productData.price,
      star: productData.star || 0,
      rateCount: productData.rateCount || 0,
      promo: productData.promo,
      detail: productData.detail,
      masp: productData.masp
    });

    // Save to database
    const savedProduct = await newProduct.save();

    // Send response
    res.status(201).json({
      success: true,
      message: 'Sản phẩm đã được tạo thành công',
      product: savedProduct
    });

  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo sản phẩm: ' + error.message
    });
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
    createUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllOrders,
    updateOrderStatus
};
