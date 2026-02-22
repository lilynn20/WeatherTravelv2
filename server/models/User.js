const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name: String,
  preferences: Object
});

module.exports = mongoose.model("User", userSchema);