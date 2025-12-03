// src/pages/startup/StartupDashboard.jsx
import React, { useEffect, useState } from "react";
import { getStartupStats } from "../../api/startup";

export default function StartupDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    inventoryItems: 0,
    lowStock: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const res = await getStartupStats();
      setStats(res.data || {});
    } catch (err) {
      console.error("Startup stats failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 text-blue-100">

      <h1 className="text-2xl font-semibold text-blue-300">
        Welcome to Startup Dashboard
      </h1>
      <p className="text-sm text-blue-200/70">
        Manage your products, track orders, and monitor inventory in real-time.
      </p>

      {loading ? (
        <p className="text-blue-300 text-sm">Loading dashboard...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Total Products */}
          <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-500/30
                          shadow-[0_0_15px_rgba(0,115,255,0.25)]">
            <div className="text-lg font-semibold text-blue-300">
              {stats.totalProducts}
            </div>
            <div className="text-xs text-blue-200/70">Products Listed</div>
          </div>

          {/* Orders */}
          <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-500/30
                          shadow-[0_0_15px_rgba(0,115,255,0.25)]">
            <div className="text-lg font-semibold text-blue-300">
              {stats.totalOrders}
            </div>
            <div className="text-xs text-blue-200/70">Total Orders</div>
          </div>

          {/* Inventory */}
          <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-500/30
                          shadow-[0_0_15px_rgba(0,115,255,0.25)]">
            <div className="text-lg font-semibold text-blue-300">
              {stats.inventoryItems}
            </div>
            <div className="text-xs text-blue-200/70">Inventory Items</div>
          </div>

          {/* Low Stock */}
          <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-500/30
                          shadow-[0_0_15px_rgba(0,115,255,0.25)]">
            <div className="text-lg font-semibold text-red-300">
              {stats.lowStock}
            </div>
            <div className="text-xs text-red-200/70">Low Stock Products</div>
          </div>

        </div>
      )}
    </div>
  );
}
