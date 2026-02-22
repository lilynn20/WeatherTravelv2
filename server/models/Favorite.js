const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  city: { type: String, required: true },
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Favorite", favoriteSchema);
