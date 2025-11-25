const rateLimit = require("express-rate-limit");

// Global limiter (gentle)
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200, // 200 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
});

// stricter limiter for auth/otp endpoints
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // e.g., 10 attempts per 5 minutes per IP
  message: { success: false, message: "Too many requests, please try later." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { globalLimiter, authLimiter };
