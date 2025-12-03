// src/pages/admin/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import { adminGetOrders, adminUpdateOrderStatus } from "../../api/admin";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [savingStatus, setSavingStatus] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  async function loadOrders() {
    setLoading(true);
    try {
      const res = await adminGetOrders(
        statusFilter === "all" ? {} : { status: statusFilter }
      );
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, newStatus) {
    setSavingStatus(id);
    try {
      await adminUpdateOrderStatus(id, newStatus);
      await loadOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setSavingStatus(null);
    }
  }

  return (
    <div className="space-y-6 text-sm">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-pink-300">
          Orders Management
        </h1>
        <p className="text-xs text-pink-100/70">
          Track, manage and update all customer orders.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["all", "pending", "paid", "shipped", "delivered", "cancelled"].map(
          (s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full border text-xs transition-all ${
                statusFilter === s
                  ? "border-pink-400 bg-pink-500/20 text-pink-200 shadow-[0_0_10px_rgba(244,114,182,0.5)]"
                  : "border-pink-800 text-pink-100 hover:border-pink-400/70"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Orders table */}
      <div className="rounded-xl bg-black/70 border border-pink-500/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs md:text-sm">
            <thead className="bg-[#1b0f17] border-b border-pink-500/30 text-pink-100/90">
              <tr className="text-left">
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Items</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-3 py-3 text-center text-pink-100">
                    Loading orders…
                  </td>
                </tr>
              ) : !orders.length ? (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-center text-pink-100/70">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr
                    key={o._id}
                    className="border-b border-pink-500/10 hover:bg-pink-500/5 transition"
                  >
                    {/* Order ID + Timestamp */}
                    <td className="px-3 py-2 align-top">
                      <div className="text-pink-100 font-medium">{o._id}</div>
                      <div className="text-[11px] text-pink-100/60">
                        {new Date(o.createdAt).toLocaleString()}
                      </div>
                    </td>

                    {/* User Snapshot */}
                    <td className="px-3 py-2 align-top">
                      <div className="text-pink-100">
                        {o.userDetails?.name || "Unknown"}
                      </div>
                      <div className="text-[11px] text-pink-300/60">
                        {o.userDetails?.email}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="px-3 py-2 align-top">
                      {o.items.map((it, i) => (
                        <div
                          key={i}
                          className="text-[11px] text-pink-100/80 border-b border-pink-500/10 py-0.5"
                        >
                          {it.quantity}× {it.productId?.name}
                        </div>
                      ))}
                    </td>

                    {/* Amount */}
                    <td className="px-3 py-2 text-pink-200 align-top">
                      ₹{o.totalAmount}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-2 align-top">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] border 
                          ${
                            o.status === "pending"
                              ? "text-yellow-300 border-yellow-400/40 bg-yellow-400/10"
                              : o.status === "paid"
                              ? "text-blue-300 border-blue-400/40 bg-blue-400/10"
                              : o.status === "shipped"
                              ? "text-cyan-300 border-cyan-400/40 bg-cyan-400/10"
                              : o.status === "delivered"
                              ? "text-emerald-300 border-emerald-400/40 bg-emerald-400/10"
                              : "text-red-300 border-red-400/40 bg-red-400/10"
                          }`}
                      >
                        {o.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-2 text-right align-top space-y-1">

                      {/* Status dropdown */}
                      <select
                        value={o.status}
                        disabled={savingStatus === o._id}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                        className="text-xs bg-black/70 border border-pink-400/40 rounded px-2 py-1 text-pink-100"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      {/* Delivery Partner assignment */}
                      <button
                        onClick={() =>
                          alert("Delivery module coming soon!")
                        }
                        className="block w-full mt-1 px-2 py-1 rounded bg-black/60 
                        border border-pink-500/40 text-pink-200 text-[11px]"
                      >
                        Assign Delivery
                      </button>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
