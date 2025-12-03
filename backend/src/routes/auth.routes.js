const router = require("express").Router();
const { authLimiter } = require("../middlewares/rateLimiter");
const authJwt = require("../middlewares/authJwt");
const { signup, login, verifyLoginOTP, me, signupStartup } = require("../controllers/auth.controller"); // <--- ADDED signupStartup to imports

// Signup (for normal users only, handled by general signup controller)
router.post("/signup", signup);

// Startup Signup: CORRECTED to use the dedicated signupStartup controller
router.post("/startup-signup", signupStartup); // <--- FIX: Use the dedicated controller

// Login: Step 1 (password → send OTP)
router.post("/login", authLimiter, login);

// Login: Step 2 (verify otp → issue token)
router.post("/verify-login-otp", authLimiter, verifyLoginOTP);

// Protected: who am I
router.get("/me", authJwt, me);

router.post("/logout", (req, res) => {
  // If you ever use cookies, clear them here
  return res.json({ success: true, message: "Logged out" });
});


module.exports = router;