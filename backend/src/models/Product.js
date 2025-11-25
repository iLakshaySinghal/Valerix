const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    slug: { type: String, required: true, unique: true },

    price: { type: Number, required: true },

    stock: { type: Number, default: 0 },

    description: { type: String },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    // ---- Startup who owns the product ----
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    isDeleted: { type: Boolean, default: false },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
