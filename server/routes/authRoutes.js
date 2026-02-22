const router = require("express").Router();
const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/signup", register); // Alias for /register
router.post("/login", login);

module.exports = router;
