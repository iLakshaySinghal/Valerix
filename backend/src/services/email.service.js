// services/email.service.js
const sendEmail = require("../utils/sendEmail");

async function sendOTPEmail(to, otp) {
  const subject = "Your Login OTP";
  const text = `Your OTP is: ${otp}. It is valid for 5 minutes.`;

  // DEV MODE: DO NOT BREAK LOGIN IF EMAIL FAILS
  try {
    await sendEmail(to, subject, text);
    console.log(`📧 OTP EMAIL SENT TO ${to}`);
  } catch (err) {
    console.error("❌ OTP email sending failed:", err.message);
    console.log(`🔐 DEV MODE OTP FOR ${to}: ${otp}`);
    // Continue silently
  }

  return true;
}

module.exports = { sendOTPEmail };
