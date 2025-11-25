const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

  // Common fields
  name: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  
  // Startup-only fields 
  gstNumber: { type: String },
  description: { type: String },

}, { timestamps: true });

module.exports = mongoose.model("Profile", ProfileSchema);
