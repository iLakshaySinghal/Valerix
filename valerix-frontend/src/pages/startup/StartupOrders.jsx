import React, { useEffect, useState } from "react";
import api from "../../utils/api";

export default function StartupOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/orders"); 
      const allOrders = res.data.orders || res.data || [];

      // filter orders containing items from THIS startup only
      const filtered = allOrders.filter((o) =>
        o.items.some((i) => i.startupDetails?.startupId)
      );

      setOrders(filtered);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  if (loading)
    return <p className="text-blue-200 text-sm">Loading orders...</p>;

  if (!orders.length)
    return (
      <p className="text-blue-200/70 text-sm">
        You haven&apos;t received any orders yet.
      </p>
    );

  return (
    <div className="space-y-6 text-blue-200">
      <h1 className="text-2xl font-semibold text-blue-300">
        Received Orders
      </h1>

      <div className="space-y-4">
        {orders.map((o) => (
          <div
            key={o._id}
            className="bg-[#0b1330]/50 p-4 rounded-xl border border-blue-500/30 
                       shadow-[0_0_20px_rgba(0,115,255,0.15)]"
          >
            {/* Order Header */}
            <div className="flex justify-between">
              <div>
                <div className="text-xs text-blue-300/70">Order ID</div>
                <div className="text-blue-200 text-xs break-all">
                  {o._id}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-blue-300/70">Status</div>
                <div className="text-blue-300 font-semibold capitalize">
                  {o.status}
                </div>
              </div>
            </div>

            {/* User Snapshot */}
            <div className="mt-3 text-xs bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
              <div className="text-blue-300 font-semibold">Customer</div>
              <div>Name: {o.userDetails?.name}</div>
              <div>Email: {o.userDetails?.email}</div>
              <div>Phone: {o.userDetails?.phone}</div>
              <div>Address: {o.userDetails?.address}</div>
            </div>

            {/* Items */}
            <div className="mt-4 space-y-2">
              <div className="text-xs text-blue-300 font-semibold">Items</div>

              {o.items
                .filter((i) => i.startupDetails?.startupId)
                .map((i) => (
                  <div
                    key={i.productId}
                    className="p-2 bg-[#0d173d] border border-blue-500/20 rounded-lg text-xs"
                  >
                    <div className="text-blue-200">{i.productId?.name}</div>
                    <div className="text-blue-200/70">
                      Qty: {i.quantity} × ₹{i.price}
                    </div>

                    {/* Revenue */}
                    <div className="text-blue-300 font-semibold mt-1">
                      Revenue: ₹{i.price * i.quantity}
                    </div>
                  </div>
                ))}
            </div>

            {/* Total */}
            <div className="mt-3 text-right text-blue-300 font-bold text-sm">
              Total Order Value: ₹{o.totalAmount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
