const {User} = require('../models/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { username, email, password } = req.body;

    // Regex kiểm tra username: chỉ cho phép chữ cái, số và dấu gạch dưới (_)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: 'Tên tài khoản không được chứa ký tự đặc biệt!' });
    }

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
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
        if (!user) return res.status(404).json({ message: 'Tên tài khoản không tồn tại' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' });

        const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
        res.status(200).json({
            message: 'Đăng nhập thành công',
            token,
            user: { username: user.username, email: user.email },
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi đăng nhập', error: error.message });
    }
};


module.exports = { register, login };