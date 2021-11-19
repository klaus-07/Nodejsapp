const express = require("express");
const auth = require("../services/services");
const cart = express();
const Cart = require("../models/cart");
const Product = require("../models/product");

cart.get("/get", auth, async (req, res) => {
  const getCart = Cart.find()
    .populate("user")
    .populate("products.id")

    .exec((err, story) => {
      if (err) {
        console.log(err);
        res.status(504).json(err);
      } else {
        res.status(202).json(story);
      }
    });
});

cart.post("/cart", auth, async (req, res, next) => {
  const { id, quantity, price } = req.body;
  const quantityExists = await Product.findById({ _id: id });
  if (quantityExists.quantity <= quantity) {
    return res.status(500).json("quantitty doesn't exists");
  }
  let total = quantity * price;
  const cart = await new Cart({
    user: req.body.user,
    products: [
      {
        id,
        quantity,
        price,
        total: total,
      },
    ],
  }).save();
  const savedProduct = await Cart.findById(cart._id).populate("products.id");
  const productData = await Product.findById({ _id: id });
  const productQuantity = await productData.quantity;
  const update = productQuantity - quantity;
  const options = { new: true };
  const productUpdate = await Product.findByIdAndUpdate(
    id,
    { quantity: update },
    options
  );
  res.status(202).json({
    success: true,
    data: productUpdate,
    data1: cart,
  });
});

module.exports = cart;
