/**
 * Script tạo tài khoản admin cho hệ thống Web_TMDT
 * Sử dụng: node scripts/createAdmin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('../models/models');
require('dotenv').config();

// Thông tin tài khoản admin cần tạo (có thể thay đổi)
const adminData = {
  fullName: 'Administrator',
  username: 'admin',
  email: 'admin@example.com',
  phone: '0123456789',
  gender: 'other',
  password: 'Admin@123', // Mật khẩu mạnh
  role: 'admin'
};

// Kết nối MongoDB
console.log('Đang kết nối đến MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/phone_store')
  .then(async () => {
    console.log('✅ Kết nối MongoDB thành công.');

    try {
      // Kiểm tra xem tài khoản admin đã tồn tại chưa
      console.log('Kiểm tra tài khoản admin...');
      const existingAdmin = await User.findOne({ 
        $or: [
          { username: adminData.username },
          { email: adminData.email }
        ]
      });
      
      if (existingAdmin) {
        console.log('⚠️ Admin đã tồn tại!');
        console.log('Thông tin tài khoản:');
        console.log(`- Username: ${existingAdmin.username}`);
        console.log(`- Email: ${existingAdmin.email}`);
        console.log(`- Quyền: ${existingAdmin.role}`);
        mongoose.connection.close();
        return;
      }

      // Mã hóa mật khẩu
      console.log('Mã hóa mật khẩu...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);

      // Tạo tài khoản admin
      console.log('Tạo tài khoản admin...');
      const admin = new User({
        fullName: adminData.fullName,
        username: adminData.username,
        email: adminData.email,
        phone: adminData.phone,
        gender: adminData.gender,
        password: hashedPassword,
        role: adminData.role,
        cart: [] // Thêm giỏ hàng trống để phù hợp với schema
      });

      // Lưu vào database
      await admin.save();

      console.log('✅ Đã tạo tài khoản admin thành công!');
      console.log('Thông tin đăng nhập:');
      console.log(`- Username: ${adminData.username}`);
      console.log(`- Password: ${adminData.password}`);
      console.log(`- Email: ${adminData.email}`);
      console.log('\n⚠️ LƯU Ý: Vui lòng thay đổi mật khẩu sau khi đăng nhập lần đầu.');
    } catch (error) {
      console.error('❌ Lỗi khi tạo tài khoản admin:', error);
    } finally {
      console.log('Đóng kết nối MongoDB...');
      mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối MongoDB:', err);
  });