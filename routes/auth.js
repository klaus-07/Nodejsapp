const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Product = require("../models/product");
const uuid = require("uuid").v4;

const { post } = require("./posts");
const auth = require("../services/services");

router.get("/get-profile", (req, res) => {
  User.find()
    .select("name email password")
    .exec()
    .then((doc) => {
      const response = {
        user: doc.map((doc) => {
          return {
            name: doc.name,
            email: doc.email,
            password: doc.password,
            id: doc._id,
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});
router.post("/register", async (req, res) => {
  const { email, password, address, name } = req.body;
  const emailexit = await User.findOne({ email });
  if (emailexit) return res.status(500).send("email does exists");
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  //create a new user
  const user = new User({
    name,
    uuid: uuid(),
    email,
    address,
    password: hash,
  });
  try {
    const saveduser = await user.save();
    res.status(201).json(saveduser);
  } catch (err) {
    res.status(400).send(err);
  }
});
router.post("/login", async (req, res) => {
  // checking if email does't exists
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(500).send("email is wrong");
  // password is correct
  const validpass = await bcrypt.compare(password, user.password);
  if (!validpass) {
    return res.status(500).json("invalid password");
  }
  const token = jwt.sign({ uuid: user.uuid }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
  // res.send("successfully logd in");
});
router.post("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const options = { new: true };
    const result = await User.findByIdAndUpdate(id, update, options);
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/user-get-product", async (req, res) => {
  const initialProduct = await Product.find({ isActive: true });
  res.status(202).json({ initialProduct });
});

module.exports = router;
