const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

const authAdmin = async (req, res, next) => {
    try {
        // Lấy token từ header
        const token = req.header('Authorization').replace('Bearer ', '');
        
        // Verify token
        const decoded = jwt.verify(token, 'secretKey');
        
        // Tìm user và kiểm tra role
        const user = await User.findOne({ 
            _id: decoded.id,
            role: 'admin' 
        });

        if (!user) {
            throw new Error('Không có quyền truy cập');
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Xác thực admin thất bại' });
    }
};

module.exports = authAdmin;
