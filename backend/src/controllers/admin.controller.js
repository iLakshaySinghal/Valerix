const InventoryService = require("../services/inventory.service");
const MetricsService = require("../services/metrics.service");
const Product = require("../models/Product");
const Profile = require("../models/Profile");

/* ------------------------------------------------------------------
   ADMIN — GET INVENTORY (with product + startup profile details)
------------------------------------------------------------------ */
exports.getInventory = async (req, res, next) => {
  try {
    const query = req.query;

    // Get inventory with pagination
    const data = await InventoryService.listInventory(query);

    // Enrich each inventory row with startup profile details
    const enrichedItems = await Promise.all(
      data.items.map(async (item) => {
        const product = await Product.findById(item.productId)
          .populate("startup", "email role")
          .lean();

        if (!product) return item;

        // Fetch startup profile
        const profile = await Profile.findOne({ userId: product.startup?._id })
          .lean();

        return {
          ...item,
          product: {
            id: product._id,
            name: product.name,
            price: product.price,
            category: product.category,
            startupId: product.startup?._id,
            startupEmail: product.startup?.email,
            startupName: profile?.startupName || "Unknown Startup",
          },
          startupName: profile?.startupName || "Unknown Startup",
        };
      })
    );

    return res.json({
      success: true,
      ...data,
      items: enrichedItems, // replace original items
    });

  } catch (err) {
    next(err);
  }
};

/* ------------------------------------------------------------------
   ADMIN — UPDATE STOCK
------------------------------------------------------------------ */
exports.updateStock = async (req, res, next) => {
  try {
    const { productId, delta, reason, refId } = req.body;

    if (!productId || typeof delta === "undefined") {
      const e = new Error("productId and delta are required");
      e.status = 400;
      throw e;
    }

    const userId = req.user ? req.user.id : null;

    const result = await InventoryService.updateQuantity({
      productId,
      delta: Number(delta),
      reason,
      refId,
      userId,
    });

    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

/* ------------------------------------------------------------------
   ADMIN — SET STOCK (ABSOLUTE)
------------------------------------------------------------------ */
exports.setStock = async (req, res, next) => {
  try {
    const { productId, quantity, reason, refId } = req.body;

    if (!productId || typeof quantity === "undefined") {
      const e = new Error("productId and quantity are required");
      e.status = 400;
      throw e;
    }

    const userId = req.user ? req.user.id : null;

    const result = await InventoryService.setQuantity({
      productId,
      quantity: Number(quantity),
      reason,
      refId,
      userId,
    });

    res.json({ success: true, ...result });

  } catch (err) {
    next(err);
  }
};

/* ------------------------------------------------------------------
   ADMIN — GET INVENTORY LOGS
------------------------------------------------------------------ */
exports.getLogs = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const data = await InventoryService.getLogs({ productId, page, limit });

    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

/* ------------------------------------------------------------------
   ADMIN — DASHBOARD METRICS
------------------------------------------------------------------ */
exports.getDashboard = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const data = await MetricsService.dashboard({
      startDate,
      endDate,
    });

    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};
