const { User } = require('../models/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng ký
const register = async (req, res) => {
    try {
        const { fullName, username, gender, email, phone, password } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!fullName || !username || !email || !phone || !password) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
        }

        // Kiểm tra username đã tồn tại chưa
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Tên đăng nhập đã được sử dụng' });
        }

        // Kiểm tra email đã tồn tại chưa
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        // Kiểm tra số điện thoại
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: 'Số điện thoại không hợp lệ' });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo người dùng mới
        const newUser = new User({
            fullName,
            username,
            gender: gender || 'other', // Mặc định là 'other' nếu không cung cấp
            email,
            phone,
            password: hashedPassword,
            role: 'user' // Mặc định là user
        });

        // Lưu người dùng vào cơ sở dữ liệu
        await newUser.save();

        // Tạo JWT token
        const token = jwt.sign({ id: newUser._id }, 'secretKey', { expiresIn: '1h' });

        res.status(201).json({
            message: 'Đăng ký thành công',
            token,
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                gender: newUser.gender,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi đăng ký', error: error.message });
    }
};

// Đăng nhập (cập nhật để trả về thêm thông tin người dùng)
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Tìm user theo username
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Tài khoản không tồn tại' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' });

        // Tạo JWT token
        const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
        
        res.status(200).json({
            message: 'Đăng nhập thành công',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                gender: user.gender,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi đăng nhập', error: error.message });
    }
};

module.exports = { register, login };