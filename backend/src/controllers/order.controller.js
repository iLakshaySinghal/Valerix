// src/controllers/order.controller.js

const OrderService = require("../services/order.service");
const Order = require("../models/Order");

// ================================
// CREATE ORDER (CHECKOUT)
// ================================
exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId, paymentMethod } = req.body;

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "addressId is required"
      });
    }

    const order = await OrderService.createOrder({
      userId,
      addressId,
      paymentMethod,
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// ================================
// GET MY ORDERS
// ================================
exports.getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await OrderService.getUserOrders(userId);

    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

// ================================
// GET SINGLE ORDER
// ================================
exports.getOrder = async (req, res, next) => {
  try {
    const order = await OrderService.getOrder(req.params.id);
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// ================================
// UPDATE ORDER STATUS (ADMIN)
// ================================
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Order status is required",
      });
    }

    const order = await OrderService.updateStatus(req.params.id, status);
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// ================================
// ASSIGN DELIVERY PARTNER (ADMIN)
// ================================
exports.assignDelivery = async (req, res, next) => {
  try {
    const { partnerId } = req.body;

    if (!partnerId) {
      return res.status(400).json({
        success: false,
        message: "partnerId is required",
      });
    }

    const order = await OrderService.assignDelivery(req.params.id, partnerId);
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// ================================
// PAY FOR ORDER (USER)
// ================================
exports.payForOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await OrderService.payForOrder({ orderId, userId });

    res.json({
      success: true,
      message: "Payment successful",
      order,
    });
  } catch (err) {
    next(err);
  }
};

// ================================
// ADMIN — GET ALL ORDERS
// ================================
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};
