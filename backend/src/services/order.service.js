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
      user: userId 
    }).lean();

    if (!address) throw new Error("Invalid address");

    // NEW: Format the full address string for the Order model's required 'address' field
    const fullAddress = `${address.line1}${address.line2 ? ', ' + address.line2 : ''}, ${address.city}, ${address.state} - ${address.pincode}, ${address.country || 'India'}`;
    
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
        addressLine1: address.line1,
        addressLine2: address.line2,
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

      // FIX FOR ownerId: Retrieve ID and check data integrity
      let itemOwnerId;
      if (product.startup && typeof product.startup === 'object') {
          // Case 1: Successfully populated (object with _id)
          itemOwnerId = product.startup._id;
      } else if (product.startup) {
          // Case 2: Not populated, but contains the raw ObjectId value (less common in modern lean() but safe fallback)
          itemOwnerId = product.startup;
      }
      
      // CRITICAL CHECK: If ownerId is missing, throw a data integrity error
      if (!itemOwnerId) {
          throw new Error(`Product data integrity error: Product ${product._id} is missing its required startup owner ID. Please fix product data.`);
      }
      
      const qty = Number(it.quantity);
      const subtotal = qty * product.price;
      totalAmount += subtotal;

      detailedItems.push({
        productId: product._id,
        quantity: qty,
        price: product.price,
        ownerId: itemOwnerId, // Use the safely retrieved ownerId
      });
    }

    // CORRECTION 2: Map "online" (frontend value) to "CARD" (backend enum value)
    const finalPaymentMethod = paymentMethod === 'online' ? 'CARD' : paymentMethod;
    
    // 5. Create order
    const order = await Order.create({
      userId,
      items: detailedItems,
      totalAmount,
      paymentMethod: finalPaymentMethod, // Use corrected enum value
      userDetails: userSnapshot,
      status: "pending",
      invoiceNumber: "",
      transactionId: "",
      address: fullAddress, // CORRECTION 1: Add the required 'address' path
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