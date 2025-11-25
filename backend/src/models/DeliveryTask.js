const mongoose = require("mongoose");

const DeliveryTaskSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true
    },

    deliveryPartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["assigned", "picked", "on_the_way", "delivered"],
      default: "assigned"
    },

    currentLocation: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null }
    },

    customerPhone: { type: String, required: true },

    customerAddress: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliveryTask", DeliveryTaskSchema);
