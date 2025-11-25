const crypto = require("crypto");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashOTP(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

function isOTPExpired(expiryTime) {
  return new Date() > new Date(expiryTime);
}

module.exports = {
  generateOTP,
  hashOTP,
  isOTPExpired
};
