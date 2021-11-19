const router = require("express").Router();
const user = require("../models/user");
const verify = require("./verifytoken");

router.get("/", verify, (req, res) => {
  res.json(req.user);
  user.findById({ _id: req.user });
});

module.exports = router;
