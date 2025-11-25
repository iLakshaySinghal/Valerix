const AuthService = require("../services/auth.service");

// SIGNUP (password-based)
exports.signup = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const data = await AuthService.signup({ name, email, phone, password, role });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// LOGIN STEP 1: password
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await AuthService.loginWithPassword({ email, password });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// LOGIN STEP 2: OTP
exports.verifyLoginOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const data = await AuthService.verifyLoginOTP({ email, otp });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
exports.me = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};



// existing: signup, login, verifyLoginOTP, me...

exports.signupStartup = async (req, res, next) => {
  try {
    const { name, email, phone, password, gstNumber, description, address } = req.body;
    const data = await AuthService.signupStartup({
      name,
      email,
      phone,
      password,
      gstNumber,
      description,
      address
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

