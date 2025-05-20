const mongoose = require('mongoose');

// Product schema
const productSchema = new mongoose.Schema({
    name: String,
    company: String,
    img: String,
    price: String,
    star: Number,
    rateCount: Number,
    promo: {
      name: String,
      value: String,
    },
    detail: {
      screen: String,
      os: String,
      camara: String,
      camaraFront: String,
      cpu: String,
      ram: String,
      rom: String,
      microUSB: String,
      battery: String,
    },
    masp: String,
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: String,
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  }, {
    timestamps: true,
    collection: 'Products',
  });
  
  const Product = mongoose.model('Product', productSchema);

// User schema
const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true }, // Họ tên
    username: { type: String, required: true, unique: true }, // Tên đăng nhập
    gender: { type: String, enum: ['male', 'female', 'other'] }, // Giới tính
    email: { type: String, required: true, unique: true }, // Email
    phone: { type: String, required: true }, // Số điện thoại
    password: { type: String, required: true }, // Mật khẩu
    role: { type: String, default: 'user' }, // Vai trò (user/admin)
    cart: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 }
        }
    ]
}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);

module.exports = {
    User,
    Product
};