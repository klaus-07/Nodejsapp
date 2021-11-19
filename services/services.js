const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  let token = req.headers["authorization"];
  token = token.split(" ")[1];
  jwt.verify(token, "access", (err, data) => {
    if (!err) {
      req.admin = data;
      next();
    } else {
      return res.status(400).json({
        message: "user not authorized",
      });
    }
  });
}

module.exports = auth;
