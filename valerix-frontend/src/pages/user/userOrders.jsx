// src/pages/user/UserOrders.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/api";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      setOrders(res.data.orders || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <div className="text-sm text-emerald-100/80">Loading orders...</div>;

  if (!orders.length)
    return (
      <div className="text-sm text-emerald-100/80">
        You don't have any orders yet.
      </div>
    );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-emerald-300">My Orders</h2>

      <div className="space-y-3 text-sm">
        {orders.map((o) => (
          <div
            key={o._id}
            className="bg-black/70 border border-emerald-500/30 rounded-xl p-3"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-400">Order ID</div>
                <div className="text-emerald-200 text-xs break-all">
                  {o._id}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-400">Total</div>
                <div className="text-emerald-300 font-semibold">
                  ₹{o.totalAmount}
                </div>
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-400">
              Status:{" "}
              <span className="capitalize text-emerald-200">{o.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
