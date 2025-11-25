const mongoose = require("mongoose");

const InventoryLogSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  change: { type: Number, required: true }, // positive: added, negative: removed
  reason: { type: String, default: "manual_update" }, // e.g. "order_placed", "return", "adjustment"
  refId: { type: String, default: "" }, // optional reference (order id, shipment id)
  userId: { // who performed the change (admin or system)
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  beforeQuantity: { type: Number },
  afterQuantity: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model("InventoryLog", InventoryLogSchema);
