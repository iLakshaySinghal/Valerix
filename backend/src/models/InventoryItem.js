const mongoose = require("mongoose");

const InventoryItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    unique: true
  },
  sku: { type: String, index: true, default: "" },
  quantity: { type: Number, default: 0 },
  reserved: { type: Number, default: 0 }, // reserved for orders but not shipped
  location: { type: String, default: "" }, // warehouse location
  reorderLevel: { type: Number, default: 5 }, // trigger reorder
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("InventoryItem", InventoryItemSchema);
