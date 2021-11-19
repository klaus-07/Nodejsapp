const mongoose = require("mongoose");
const product = require("./product");

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },

  products: [
    {
      id: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
      price: Number,
      total: Number,
    },
  ],
});
module.exports = mongoose.model("Cart", CartSchema);
