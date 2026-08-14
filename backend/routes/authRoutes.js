const express = require("express");

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);
router.post("/logout", logoutUser);

module.exports = router;