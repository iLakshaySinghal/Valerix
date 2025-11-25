// src/services/order.service.js

const Order = require("../models/Order");
const Product = require("../models/Product");
const InventoryService = require("./inventory.service");
const CartService = require("./cart.service");
const Profile = require("../models/Profile");
const Address = require("../models/Address");
const { generateInvoiceNumber } = require("../utils/invoice.util");

class OrderService {

  /**
   * -----------------------------
   * CREATE ORDER (CHECKOUT)
   * -----------------------------
   */
  static async createOrder({ userId, addressId, paymentMethod }) {
    if (!addressId) throw new Error("Address is required");

    // 1. Get cart items
    const cart = await CartService.getCart(userId);
    if (!cart || cart.items.length === 0)
      throw new Error("Cart is empty");

    // 2. Validate address
    const address = await Address.findOne({
      _id: addressId,
      userId
    }).lean();

    if (!address) throw new Error("Invalid address");

    // 3. User profile snapshot
    const profile = await Profile.findOne({ userId }).lean();

    const userSnapshot = {
      userId,
      name: profile?.name || "Unknown User",
      phone: profile?.phone || "",
      email: profile?.email || "",
      address: {
        name: address.name,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        pincode: address.pincode
      }
    };

    // 4. Build item snapshots
    let totalAmount = 0;
    const detailedItems = [];

    for (const it of cart.items) {
      const product = await Product.findById(it.productId)
        .populate("startup", "email name")
        .lean();

      if (!product) throw new Error("Product not found");

      const qty = Number(it.quantity);
      const subtotal = qty * product.price;
      totalAmount += subtotal;

      detailedItems.push({
        productId: product._id,
        name: product.name,
        quantity: qty,
        price: product.price,
        ownerId: product.startup?._id,
      });
    }

    // 5. Create order
    const order = await Order.create({
      userId,
      items: detailedItems,
      totalAmount,
      paymentMethod,
      userDetails: userSnapshot,
      status: "pending",
      invoiceNumber: "",
      transactionId: "",
    });

    return order;
  }

  /**
   * -----------------------------
   * PAYMENT SUCCESS
   * -----------------------------
   */
  static async payForOrder({ orderId, userId }) {
    let order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    if (order.userId.toString() !== userId.toString()) {
      const e = new Error("Not authorized");
      e.status = 403;
      throw e;
    }

    if (order.status !== "pending") {
      throw new Error("Order already paid or cannot be paid");
    }

    // 1. Deduct product inventory
    for (const it of order.items) {
      await InventoryService.updateQuantity({
        productId: it.productId,
        delta: -it.quantity,
        reason: "order_paid",
        refId: order._id.toString(),
        userId
      });
    }

    // 2. Generate invoice
    const invoiceNumber = generateInvoiceNumber();

    order.invoiceNumber = invoiceNumber;
    order.transactionId = invoiceNumber;
    order.status = "paid";
    await order.save();

    // 3. Clear cart
    await CartService.clearCart(userId);

    // 4. Populate product details for response
    order = await Order.findById(orderId)
      .populate("items.productId", "name price")
      .lean();

    return order;
  }

  /**
   * -----------------------------
   * USER: GET ALL ORDERS
   * -----------------------------
   */
  static async getUserOrders(userId) {
    return Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
  }

  /**
   * -----------------------------
   * USER/ADMIN: GET SINGLE ORDER
   * -----------------------------
   */
  static async getOrder(orderId) {
    const order = await Order.findById(orderId)
      .populate("items.productId", "name price images")
      .lean();

    if (!order) throw new Error("Order not found");
    return order;
  }

  /**
   * -----------------------------
   * ADMIN — UPDATE STATUS
   * -----------------------------
   */
  static async updateStatus(orderId, status) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    order.status = status;
    await order.save();
    return order;
  }

  /**
   * -----------------------------
   * ADMIN — ASSIGN DELIVERY PARTNER
   * -----------------------------
   */
  static async assignDelivery(orderId, partnerId) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    order.deliveryPartnerId = partnerId;
    order.status = "shipped";
    await order.save();
    return order;
  }

  /**
   * -----------------------------
   * ADMIN — LIST ALL ORDERS
   * -----------------------------
   */
  static async getAllOrders() {
    return Order.find({})
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 })
      .lean();
  }
}

module.exports = OrderService;
