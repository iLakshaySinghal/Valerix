const router = require("express").Router();
const { authLimiter } = require("../middlewares/rateLimiter");
const authJwt = require("../middlewares/authJwt");
const { signup, login, verifyLoginOTP, me } = require("../controllers/auth.controller");

// Signup (no rate limit needed, optional)
router.post("/signup", signup);              // normal user
router.post("/startup-signup", (req, res, next) => {
  req.body.role = "startup";
  signup(req, res, next);
});
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
