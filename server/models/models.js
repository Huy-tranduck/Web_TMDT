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
    role: { 
        type: String, 
        enum: ['user', 'admin'],
        default: 'user'
    },
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

// Order schema
const OrderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    products: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product',
            required: true
        },
        quantity: Number,
        price: Number,
        name: String,
        img: String
    }],
    totalAmount: { 
        type: Number, 
        required: true 
    },
    shippingMethod: { 
        type: String, 
        required: true 
    },
    paymentMethod: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'],
        default: 'pending'
    },
    voucher: String
}, {
    timestamps: true,
    collection: 'Orders' // Thêm dòng này để chỉ định collection name
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = {
    User,
    Product,
    Order
};