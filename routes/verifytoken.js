const jwt = require("jsonwebtoken");
const { rawListeners } = require("../models/user");
module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(500).send("access denied");
  }
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json("invalid token");
  }
};
