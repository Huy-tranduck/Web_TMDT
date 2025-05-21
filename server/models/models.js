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
        value: String
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
        battery: String
    },
    masp: String
}, {
    timestamps: true,
    collection: 'Products'
});

const Product = mongoose.model('Product', productSchema);

// User schema
const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
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