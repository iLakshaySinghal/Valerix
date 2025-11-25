const InventoryItem = require("../models/InventoryItem");
const InventoryLog = require("../models/InventoryLog");
const Product = require("../models/Product");

/**
 * InventoryService
 * - central place to update inventory and keep audit logs
 */
class InventoryService {

  // Ensure inventory item exists for product
  static async ensureInventoryForProduct(productId) {
    let item = await InventoryItem.findOne({ productId });
    if (!item) {
      item = await InventoryItem.create({ productId, quantity: 0 });
    }
    return item;
  }

  // Get inventory list with pagination and optional filters
  static async listInventory({ page = 1, limit = 20, q, lowStock = false }) {
    const filter = {};

    // Search by SKU or product name
    if (q) {
      const products = await Product.find({
        name: { $regex: q, $options: "i" }
      }).select("_id").lean();

      const pids = products.map(p => p._id);
      filter.$or = [
        { sku: { $regex: q, $options: "i" } },
        { productId: { $in: pids } }
      ];
    }

    // Low stock filter
    if (lowStock) {
      filter.$expr = { $lte: ["$quantity", "$reorderLevel"] };
    }

    const skip = (page - 1) * Number(limit);

    const [items, total] = await Promise.all([
      InventoryItem.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        // ⬇ POPULATE STARTUP INFO TOO
        .populate("productId", "name price startup")
        .lean(),
      InventoryItem.countDocuments(filter)
    ]);

    return {
      items,
      total,
      page,
      pages: Math.ceil(total / limit) || 1
    };
  }

  // Update quantity (delta can be positive or negative)
  static async updateQuantity({ productId, delta, reason = "manual_update", refId = "", userId = null }) {
    const item = await InventoryService.ensureInventoryForProduct(productId);

    const before = item.quantity;
    const after = before + Number(delta);

    if (after < 0) {
      throw Object.assign(new Error("Insufficient stock"), { status: 400 });
    }

    // Update inventory quantity
    item.quantity = after;
    await item.save();

    // ⬇ KEEP PRODUCT.STOCK SYNCED
    await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: Number(delta) } },
      { new: true }
    );

    // Create log
    const log = await InventoryLog.create({
      productId,
      change: delta,
      reason,
      refId,
      userId,
      beforeQuantity: before,
      afterQuantity: after
    });

    return { item, log };
  }

  // Set absolute quantity (overwrite)
  static async setQuantity({ productId, quantity, reason = "set_quantity", refId = "", userId = null }) {
    const item = await InventoryService.ensureInventoryForProduct(productId);

    const before = item.quantity;
    const finalQty = Number(quantity);

    // Update inventory entry
    item.quantity = finalQty;
    await item.save();

    // ⬇ OVERRIDE PRODUCT.STOCK ALSO
    await Product.findByIdAndUpdate(
      productId,
      { stock: finalQty },
      { new: true }
    );

    // Create inventory log
    const log = await InventoryLog.create({
      productId,
      change: finalQty - before,
      reason,
      refId,
      userId,
      beforeQuantity: before,
      afterQuantity: finalQty
    });

    return { item, log };
  }

  // Get inventory record for a product
  static async getByProduct(productId) {
    return InventoryItem
      .findOne({ productId })
      .populate("productId", "name price startup")
      .lean();
  }

  // Get logs for product
  static async getLogs({ productId, page = 1, limit = 50 }) {
    const skip = (page - 1) * Number(limit);

    const [items, total] = await Promise.all([
      InventoryLog.find({ productId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      InventoryLog.countDocuments({ productId })
    ]);

    return {
      items,
      total,
      page,
      pages: Math.ceil(total / limit) || 1
    };
  }
}

module.exports = InventoryService;
