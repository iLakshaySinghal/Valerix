const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null } // optional tree
}, { timestamps: true });

module.exports = mongoose.model("Category", CategorySchema);
