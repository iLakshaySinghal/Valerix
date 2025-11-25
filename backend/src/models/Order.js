const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { _id: false });

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [OrderItemSchema],

    totalAmount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending"
    },

    address: {
      type: String,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "CARD"],
      required: true
    },

    transactionId: {
      type: String,
      default: ""
    },

    invoiceNumber: {
      type: String,
      default: ""
    },

    deliveryPartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
