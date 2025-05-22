const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { getActiveBanners } = require('./controllers/adminController');
const voucherRoutes = require('./routes/voucherRoutes');
require('dotenv').config();
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Cấu hình để phục vụ tệp tĩnh
app.use(express.static('public'));

// Đảm bảo thư mục tồn tại
const fs = require('fs');
const path = require('path');

// Thay đổi đường dẫn sang thư mục client
const bannerDir = path.join(__dirname, '../client/public/images/banners');
if (!fs.existsSync(bannerDir)) {
  fs.mkdirSync(bannerDir, { recursive: true });
  console.log(`Đã tạo thư mục banner tại: ${bannerDir}`);
}

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes); 
app.use('/api/admin', adminRoutes);
app.get('/api/banners/active', getActiveBanners);
app.use('/api/vouchers', voucherRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something broke!',
        error: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
