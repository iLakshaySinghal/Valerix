import React, { useEffect, useState } from "react";
import { getOrders } from "../api/orders";
import NeonLoader from "../components/ui/NeonLoader";
import { Link } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ load(); }, []);

  async function load(){
    setLoading(true);
    try {
      const res = await getOrders();
      setOrders(res.data.orders || res.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  if (loading) return <NeonLoader />;
  if (!orders || orders.length === 0) return <div className="p-6">No orders</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl">Your Orders</h2>
      {orders.map(o => (
        <div key={o._id} className="p-4 bg-[#0f0f11] border border-zinc-800 rounded">
          <div className="flex justify-between">
            <div>
              <div className="font-semibold">Order #{o._id}</div>
              <div className="text-sm text-zinc-400">{new Date(o.createdAt).toLocaleString()}</div>
            </div>
            <div className="text-neon">{o.status || "PLACED"}</div>
          </div>
          <div className="mt-2">
            {o.items?.map(it => (
              <div key={it.productId} className="flex gap-2 items-center">
                <img src={it.product?.images?.[0]?.url || "/mnt/data/06787b30-a3dd-4dff-a854-ffa3134458d7.png"} alt="" className="w-12 h-12 object-cover rounded" />
                <div>
                  <div className="font-medium">{it.product?.name}</div>
                  <div className="text-sm text-zinc-400">x {it.quantity}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Link to={`/orders/${o._id}`} className="text-sm text-neon">View details</Link>
          </div>
        </div>
      ))}
    </div>
  );
}
