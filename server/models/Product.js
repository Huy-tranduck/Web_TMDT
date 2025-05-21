const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  img: { type: String, required: true },
  price: { type: String, required: true },
  star: { type: Number, default: 0 },
  rateCount: { type: Number, default: 0 },
  promo: {
    name: { type: String },
    value: { type: String }
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
  masp: { type: String, required: true, unique: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
