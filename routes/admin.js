const express = require("express");
const admin = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");
const auth = require("../services/services");
const user = require("../models/user");
let refreshTokens = [];

admin.post("/renew", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(404).json({
      message: "user not authorized",
    });
  }
  jwt.verify(refreshToken, "refresh", (err, data) => {
    if (!err) {
      const accessToken = jwt.sign({ data: data.name }, "access", {
        expiresIn: "25s",
      });
      return res.status(201).json(accessToken);
    } else {
      return res.status(404).json({
        message: "user not authorized",
      });
    }
  });
});

admin.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //  Finding user using email & if not found throw an error
  const admin = await Admin.findOne({ email });
  if (!admin)
    return res.status(404).json("User with provided email is not exist");

  //  Check password
  const validPassword = await bcrypt.compare(password, admin.password);
  if (!validPassword) return res.status(500).json("invalid password");

  let accessToken = jwt.sign({ id: admin._id }, "access", {
    expiresIn: "20d",
  });
  let refreshToken = jwt.sign({ id: admin._id }, "refresh", {
    expiresIn: "25d",
  });
  refreshTokens.push(refreshToken);
  return res.status(200).json({
    accessToken,
    refreshToken,
  });
  // res.send("successfull logd in");
});

module.exports = admin;
