const mongoose = require('mongoose');

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
    collection: 'Products' // Thêm dòng này để chỉ định rõ tên collection
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

