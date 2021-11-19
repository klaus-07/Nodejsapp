const express = require("express");
const multer = require("multer");
const Product = require("../models/product");
const admin = require("./admin");
const auth = require("../services/services");
const { formatProduct, formatProducts } = require("../helper/product");

const product = express();
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });

product.get("/get-product", auth, async (req, res, next) => {
  const getProduct = await Product.find().populate("category");
  const formatedProducts = formatProducts(getProduct);
  res.status(201).json(formatedProducts);
});
product.post("/get-category-product", auth, async (req, res, next) => {
  const productsData = await Product.find({
    category: req.body.category,
  }).populate("category");
  const formatedProducts = formatProducts(productsData);
  res.status(201).json(formatedProducts);
});

product.post(
  "/create-product",
  auth,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const { name } = req.body;
      //  Checking the same product exist or not
      const nameExist = await Product.findOne({ name });

      //  if exist, show message
      if (nameExist) {
        return res.status(500).send("name exists already");
      }

      //  else create a new product
      const result = await new Product({
        name: req.body.name,
        productImage: req.file.path,
        cloth: req.body.cloth,
        price: req.body.price,
        color: req.body.color,
        size: req.body.size,
        quantity: req.body.quantity,
        category: req.body.category,
      }).save();

      const savedProduct = await Product.findById(result._id).populate(
        "category"
      );

      console.log(result);
      res.status(202).json({
        success: true,
        data: formatProduct(savedProduct),
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
);
product.post(
  "/update",
  upload.single("image"),
  auth,
  async (req, res, next) => {
    const thing = req.body;
    Product.updateOne({ _id: req.body.id }, thing)
      .then(() => {
        res.status(201).json({ thing });
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  }
);
product.post("/delete", auth, async (req, res, next) => {
  // const id = "6141e493ba783ef5687ed00c";
  Product.findByIdAndDelete({ _id: req.body.id }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.json(docs);
      console.log("Deleted : ", docs);
    }
  });
});

module.exports = product;
