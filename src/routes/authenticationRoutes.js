const express = require("express");
const rateLimit = require("express-rate-limit");
const { register } = require("../controllers/auth/registerController");
const { login } = require("../controllers/auth/loginController");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many requests. Please try again after 15 minutes." }
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

module.exports = router;
