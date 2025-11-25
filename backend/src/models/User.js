const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },

    email: {
      type: String,
      unique: true,
      sparse: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
    },

    role: {
      type: String,
      enum: ["user", "startup", "admin", "delivery"],
      default: "user",
    },

    // 🔐 Password (hashed)
    passwordHash: {
      type: String,
      required: false, // we'll enforce in service, not schema
    },

    // OTP fields
    otpHash: String,
    otpExpiresAt: Date,

    isVerified: { type: Boolean, default: false },

    // Default address reference
    defaultAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
