const Order = require("../models/Order");
const InvoiceService = require("../services/invoice.service");

exports.getInvoicePdf = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findById(orderId)
      .populate("userId", "name email")
      .populate("items.productId", "name price")
      .lean();

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Only the owner or admin can view invoice
    if (order.userId._id.toString() !== userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    InvoiceService.generateInvoicePdf(order, res);

  } catch (err) {
    next(err);
  }
};
