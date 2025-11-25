import React, { useEffect, useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/orders";
import NeonLoader from "../components/ui/NeonLoader";
import api from "../utils/api";

export default function Checkout() {
  const { items, init } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const nav = useNavigate();

  useEffect(() => { init(); loadAddresses(); }, []);

  async function loadAddresses(){
    try {
      const res = await api.get("/address");
      setAddresses(res.data.list || []);
      if (res.data.list?.length) setSelected(res.data.list[0]._id);
    } catch (e) { console.error(e); }
  }

  async function placeOrder(){
    if (!selected) return alert("Select address");
    setLoading(true);
    try {
      const payload = {
        addressId: selected,
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        paymentMethod: "COD" // for now
      };
      const res = await createOrder(payload);
      nav(`/orders`);
    } catch (e) { console.error(e); alert("Order failed"); }
    finally { setLoading(false); }
  }

  if (!items || items.length === 0) return <div className="p-6">Cart empty</div>;
  if (loading) return <NeonLoader />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-2xl">Select delivery address</h2>
        {addresses.map(a => (
          <div key={a._id} className={`p-4 rounded border ${selected===a._id ? "border-neon" : "border-zinc-800"}`}>
            <label className="flex items-center gap-3">
              <input type="radio" checked={selected===a._id} onChange={()=>setSelected(a._id)} />
              <div>
                <div className="font-semibold">{a.line1}</div>
                <div className="text-sm text-zinc-400">{a.city}, {a.state} - {a.pincode}</div>
              </div>
            </label>
          </div>
        ))}
      </div>

      <div className="bg-[#0b0b0d] p-4 rounded border border-zinc-800">
        <h3 className="text-xl">Summary</h3>
        <div className="mt-4">
          {items.map(it => (
            <div key={it.productId} className="flex justify-between mb-2">
              <div>{it.product?.name} x {it.quantity}</div>
              <div>₹{(it.product?.price||0)*it.quantity}</div>
            </div>
          ))}
          <div className="mt-4">
            <button onClick={placeOrder} className="w-full px-4 py-2 bg-neon rounded">Place Order (COD)</button>
          </div>
        </div>
      </div>
    </div>
  );
}
