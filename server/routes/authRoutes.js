const express = require("express");
const router = express.Router();
const {
  register,
  login,
  googleLogin,
  googleRegister,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/google/register", googleRegister);

module.exports = router;
