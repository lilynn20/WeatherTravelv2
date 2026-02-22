const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  register,
  registerValidation,
  login,
  loginValidation,
  logout,
  me,
  forgotPassword,
  resetPassword,
  updatePreferences,
} = require("../controllers/authController");

router.post("/register", registerValidation, register);
router.post("/signup", registerValidation, register); // alias
router.post("/login", loginValidation, login);
router.post("/logout", logout);
router.get("/me", auth, me);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/preferences", auth, updatePreferences);

module.exports = router;
