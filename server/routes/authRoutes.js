const router = require("express").Router();
const { register, login, logout } = require("../controllers/authController");

router.post("/register", register);
router.post("/signup", register); // Alias for /register
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
