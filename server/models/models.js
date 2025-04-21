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
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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