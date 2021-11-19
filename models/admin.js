const mongoose = require("mongoose");
const { isEmail } = require("validator");

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [isEmail],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});
module.exports = mongoose.model("Admin", AdminSchema);
