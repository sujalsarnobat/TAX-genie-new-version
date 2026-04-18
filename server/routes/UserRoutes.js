const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const OTPController = require("../controllers/OTPController");
const { signupValidation, loginValidation } = require("../middleware/validate");

// Auth routes
router.post('/signup', signupValidation, UserController.signup);
router.post('/login', loginValidation, UserController.login);

// OTP routes (signup)
router.post('/send-otp', OTPController.sendSignupOTP);
router.post('/verify-otp', OTPController.verifySignupOTP);

// Forgot password routes
router.post('/forgot-password', OTPController.sendForgotPasswordOTP);
router.post('/reset-password', OTPController.resetPassword);

module.exports = router;
