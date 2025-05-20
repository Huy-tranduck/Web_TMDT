const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  orderId: { type: String },
  items: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number },
      name: { type: String },
      img: { type: String },
    },
  ],
});

module.exports = mongoose.model("Cart", CartSchema);