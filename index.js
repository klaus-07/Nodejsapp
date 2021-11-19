const express = require("express");
const app = express();

const bodyparser = require("body-parser");

//import routes
const authRouter = require("./routes/auth");
const mongoose = require("mongoose");
const seedAdmin = require("./connectiondb");
const adminRouter = require("./routes/admin");
const postsrouter = require("./routes/posts");
const productRouter = require("./routes/product");
const categoryRouter = require("./routes/category");
const cartRouter = require("./routes/cart");

const { init } = require("./models/user");
const dotenv = require("dotenv").config();
//connect database
mongoose
  .connect("mongodb://127.0.0.1:27017/apifirst", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    seedAdmin();
  })
  .catch((err) => {
    console.log("error:", err);
  });
//
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
// app.use(express, json());
//roue middleware
app.use("/api/user", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/posts", postsrouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/cart", cartRouter);
app.use("/images", express.static("images")); //make a folder public
app.listen(2000, () => console.log("server start"));
