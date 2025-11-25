// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/api";

// Metric Card (pink)
function Stat({ label, value, sub }) {
  return (
    <div className="bg-black/70 border border-pink-400/40 rounded-xl p-4 shadow-[0_0_20px_rgba(244,114,182,0.35)]">
      <div className="text-[11px] uppercase tracking-[0.16em] text-pink-200/80">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-pink-300">{value}</div>
      {sub && <div className="mt-1 text-[11px] text-pink-100/70">{sub}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
    loadOrders();
  }, []);

  async function loadDashboard() {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  async function loadOrders() {
    try {
      const res = await api.get("/orders/admin/all");
      setOrders((res.data.orders || []).slice(0, 5));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <div className="text-sm text-pink-100/80">Loading dashboard…</div>;

  const {
    totalRevenue = 0,
    totalOrders = 0,
    totalUsers = 0,
    totalStartups = 0,
  } = stats || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-pink-300">
          Admin Overview
        </h1>
        <p className="text-xs text-pink-100/70">
          Revenue, user metrics & order performance.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Stat
          label="Total Revenue"
          value={`₹${Number(totalRevenue).toLocaleString()}`}
        />
        <Stat label="Total Orders" value={totalOrders} />
        <Stat label="Users" value={totalUsers} />
        <Stat label="Startups" value={totalStartups} />
      </div>

      {/* Recent Orders */}
      <div className="bg-black/70 border border-pink-400/40 rounded-xl p-4 shadow-[0_0_20px_rgba(244,114,182,0.35)]">
        <h3 className="text-pink-300 mb-3 font-semibold">Recent Orders</h3>

        <div className="overflow-x-auto text-sm">
          <table className="w-full">
            <thead className="border-b border-pink-500/20 text-pink-200 text-xs">
              <tr className="text-left">
                <th className="p-2">Order ID</th>
                <th className="p-2">User</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr
                  key={o._id}
                  className="border-b border-pink-500/10 text-pink-100"
                >
                  <td className="p-2">{o._id}</td>
                  <td className="p-2">{o.userId?.email}</td>
                  <td className="p-2">₹{o.totalAmount}</td>
                  <td className="p-2 capitalize">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
