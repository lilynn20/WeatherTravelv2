const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, trim: true, maxlength: 80 },
    isVerified: { type: Boolean, default: false },
    verifyToken: { type: String, default: null },
    resetToken: { type: String, default: null },
    resetTokenExpires: { type: Date, default: null },
    preferences: {
      units: { type: String, enum: ["metric", "imperial"], default: "metric" },
      language: { type: String, enum: ["en", "fr"], default: "en" },
      homeCity: { type: String, default: "" },
      notifications: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);