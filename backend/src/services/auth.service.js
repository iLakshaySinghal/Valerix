const User = require("../models/User");
const Profile = require("../models/Profile");
const { generateOTP, hashOTP, isOTPExpired } = require("../utils/otp.util");
const { sendOTPEmail } = require("./email.service");
const { signPayload } = require("../config/jwt");
const { hashPassword, comparePassword } = require("../utils/password.util");

class AuthService {

  // =====================================================
  // ENSURE DEFAULT ADMIN
  // =====================================================
  static async ensureDefaultAdmin() {
    const existingAdmin = await User.findOne({ role: "admin" }).lean();
    if (existingAdmin) return;

    const passwordHash = await hashPassword("123456789");

    await User.create({
      name: "Lakshay Singhal",
      email: "admin@valerix.com",
      role: "admin",
      passwordHash,
      isVerified: true
    });

    console.log("✅ Default admin created: admin@valerix.com / 123456789");
  }

  // =====================================================
  // NORMAL USER SIGNUP
  // =====================================================
  static async signup({ name, email, phone, password, role = "user" }) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Do NOT allow admin via this route
    if (role === "admin") {
      throw new Error("Admin signup not allowed");
    }

    const existing = await User.findOne({ email });
    if (existing) {
      throw new Error("User already exists with this email");
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      phone,
      role: role || "user",
      passwordHash,
      isVerified: false
    });

    return {
      success: true,
      message: "Signup successful. Please login.",
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    };
  }

  // =====================================================
  // STARTUP SIGNUP (SEPARATE ENDPOINT)
  // =====================================================
  static async signupStartup({ name, email, phone, password, gstNumber, description, address }) {
    if (!name || !email || !password) {
      throw new Error("Name, email and password are required");
    }

    const existing = await User.findOne({ email });
    if (existing) {
      throw new Error("User already exists with this email");
    }

    const passwordHash = await hashPassword(password);

    // Create startup user
    const user = await User.create({
      name,
      email,
      phone,
      role: "startup",
      passwordHash,
      isVerified: false
    });

    // Create startup profile
    await Profile.create({
      userId: user._id,
      name,
      phone,
      address,
      gstNumber,
      description
    });

    return {
      success: true,
      message: "Startup signup successful. Please login to continue.",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    };
  }

  // =====================================================
  // LOGIN STEP 1 — PASSWORD → OTP
  // =====================================================
  static async loginWithPassword({ email, password }) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) throw new Error("Invalid credentials");

    const otp = generateOTP();
    const hashed = hashOTP(otp);

    user.otpHash = hashed;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    try {
      await sendOTPEmail(email, otp);
    } catch (err) {
      console.error("❌ OTP Email Failed:", err.message);
      return {
        success: true,
        step: "OTP_REQUIRED",
        message: "OTP generated (email sending failed in DEV)",
        otp,
        role: user.role
      };
    }

    return {
      success: true,
      step: "OTP_REQUIRED",
      message: "OTP sent to your email.",
      role: user.role
    };
  }

  // =====================================================
  // LOGIN STEP 2 — VERIFY OTP → TOKEN
  // =====================================================
  static async verifyLoginOTP({ email, otp }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    if (!user.otpHash) throw new Error("OTP not requested");
    if (isOTPExpired(user.otpExpiresAt)) throw new Error("OTP expired");

    const hashed = hashOTP(otp);
    if (hashed !== user.otpHash) throw new Error("Invalid OTP");

    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    user.isVerified = true;
    await user.save();

    const token = signPayload({
      id: user._id.toString(),
      email: user.email,
      role: user.role
    });

    return {
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    };
  }
}

module.exports = AuthService;
