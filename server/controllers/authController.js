const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Validation rules
exports.registerValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("name").trim().notEmpty().withMessage("Name is required"),
];

exports.loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required"),
];

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "An account with this email already exists." });

    const hash = await bcrypt.hash(password, 12);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({ email, password: hash, name, verifyToken });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(201).json({
      message: "Account created successfully.",
      user: { id: user._id, email: user.email, name: user.name, preferences: user.preferences },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid email or password." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, COOKIE_OPTIONS);

    res.json({
      message: "Login successful.",
      user: { id: user._id, email: user.email, name: user.name, preferences: user.preferences },
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
    res.json({ message: "Logged out successfully." });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me — return current user from cookie
exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password -verifyToken -resetToken -resetTokenExpires");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required." });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    // Always return success to avoid email enumeration
    if (!user) return res.json({ message: "If that email exists, a reset link has been sent." });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Email sending (non-blocking — fails gracefully if not configured)
    try {
      const emailService = require("../services/emailService");
      const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5174"}/reset-password?token=${resetToken}`;
      await emailService.sendPasswordReset(user.email, user.name || "there", resetUrl);
    } catch (emailErr) {
      console.warn("Password reset email failed to send:", emailErr.message);
    }

    res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: "Token and new password required." });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters." });

    const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: new Date() } });
    if (!user) return res.status(400).json({ message: "Reset token is invalid or has expired." });

    user.password = await bcrypt.hash(password, 12);
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    next(err);
  }
};

// PUT /api/auth/preferences — update user preferences
exports.updatePreferences = async (req, res, next) => {
  try {
    const { units, language, homeCity, notifications } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (units) user.preferences.units = units;
    if (language) user.preferences.language = language;
    if (homeCity !== undefined) user.preferences.homeCity = homeCity;
    if (notifications !== undefined) user.preferences.notifications = notifications;

    await user.save();
    res.json({ preferences: user.preferences });
  } catch (err) {
    next(err);
  }
};