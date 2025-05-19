const {User} = require('../models/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi đăng ký', error: error.message });
    }
};


const login = async (req, res) => {
    const email = req.body.email.toLowerCase();
    const { password } = req.body;

    try {
        const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' });

        const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
        res.status(200).json({
            message: 'Đăng nhập thành công',
            token,
            user: {
                username: user.username,
                email: user.email,
                role: user.role // Thêm role vào response
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi đăng nhập', error: error.message });
    }
};


module.exports = { register, login };