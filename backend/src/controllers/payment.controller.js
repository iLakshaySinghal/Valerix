const OrderService = require("../services/order.service");
const { generateInvoiceNumber } = require("../utils/invoice.util");
const Order = require("../models/Order");

exports.payOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.orderId;

    const updatedOrder = await OrderService.payForOrder({ orderId, userId });

    return res.json({
      success: true,
      message: "Payment successful",
      order: updatedOrder,
      invoice: updatedOrder.invoiceNumber
    });

  } catch (err) {
    next(err);
  }
};

// OPTIONAL: Admin view all invoices
exports.getAllInvoices = async (req, res, next) => {
  try {
    const orders = await Order.find({
      invoiceNumber: { $exists: true, $ne: "" }
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, invoices: orders });

  } catch (err) {
    next(err);
  }
};
