const InventoryItem = require("../models/InventoryItem");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");

class MetricsService {

  // Inventory KPIs
  static async inventoryKPIs() {
    const totalSKUs = await InventoryItem.countDocuments({});
    const outOfStock = await InventoryItem.countDocuments({ quantity: { $lte: 0 } });
    const lowStock = await InventoryItem.countDocuments({
      $expr: { $lte: ["$quantity", "$reorderLevel"] }
    });

    return { totalSKUs, outOfStock, lowStock };
  }

  static getDefaultRange({ startDate, endDate }) {
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return { start, end };
  }

  static async dashboard({ startDate, endDate } = {}) {
    const { start, end } = MetricsService.getDefaultRange({ startDate, endDate });

    // Only count orders that actually generate revenue
    const paidOrders = await Order.find({
      createdAt: { $gte: start, $lte: end },
      status: { $in: ["paid", "shipped", "delivered"] }
    })
      .select("items totalAmount createdAt")
      .lean();

    const totalOrders = paidOrders.length;
    const totalRevenue = paidOrders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0
    );
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Daily revenue & orders
    const dailyRevenueMap = new Map();
    const dailyOrdersMap = new Map();
    const monthlyMap = new Map();

    for (const o of paidOrders) {
      const d = new Date(o.createdAt);
      const dayKey = `${d.getMonth() + 1}/${d.getDate()}`;
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      dailyRevenueMap.set(dayKey, (dailyRevenueMap.get(dayKey) || 0) + (o.totalAmount || 0));
      dailyOrdersMap.set(dayKey, (dailyOrdersMap.get(dayKey) || 0) + 1);
      monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + (o.totalAmount || 0));
    }

    const salesByDay = Array.from(dailyRevenueMap.entries()).map(([label, revenue]) => ({
      label,
      revenue,
    }));

    const ordersByDay = Array.from(dailyOrdersMap.entries()).map(([label, orders]) => ({
      label,
      orders,
    }));

    const monthlyRevenue = Array.from(monthlyMap.entries()).map(([month, revenue]) => ({
      month,
      revenue,
    }));

    // Category breakdown (by revenue)
    const categoryAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $in: ["paid", "shipped", "delivered"] },
        },
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "prod",
        },
      },
      { $unwind: "$prod" },
      {
        $lookup: {
          from: "categories",
          localField: "prod.category",
          foreignField: "_id",
          as: "cat",
        },
      },
      { $unwind: { path: "$cat", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$cat.name",
          value: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
    ]);

    const categoryBreakdown = categoryAgg.map((c) => ({
      category: c._id || "Uncategorized",
      value: c.value,
    }));

    // Low stock items (<= reorderLevel or default 5)
    const lowStockItems = await InventoryItem.find({
      $expr: {
        $lte: [
          "$quantity",
          { $cond: [{ $gt: ["$reorderLevel", 0] }, "$reorderLevel", 5] },
        ],
      },
    })
      .populate("productId", "name price startup")
      .lean();

    const inventoryKpis = await MetricsService.inventoryKPIs();

    // Global user metrics
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalStartups = await User.countDocuments({ role: "startup" });

    return {
      // Flattened summary used by AdminDashboard.jsx
      totalRevenue,
      totalOrders,
      avgOrderValue,
      totalUsers,
      totalStartups,

      // Structured sections used by AdminMetrics.jsx
      sales: {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        salesByDay,
        ordersByDay,
        monthlyRevenue,
        categoryBreakdown,
      },
      inventory: {
        ...inventoryKpis,
        lowStockCount: lowStockItems.length,
        lowStockItems,
      },
      traffic: {
        // Placeholder values – hook these up to real analytics if available
        pageViews: 0,
        uniqueVisitors: 0,
        avgSessionDuration: 0,
      },
    };
  }
}

module.exports = MetricsService;
