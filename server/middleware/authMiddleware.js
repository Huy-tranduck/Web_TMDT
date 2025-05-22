const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secretKey'); // Đảm bảo secretKey giống với key khi tạo token
    req.user = decoded;
    next();
  } catch (error) {
    // Thêm thông tin lỗi chi tiết hơn
    console.log('Auth error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token đã hết hạn, vui lòng đăng nhập lại' });
    }
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

module.exports = { authMiddleware };