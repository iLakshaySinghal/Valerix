import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import NeonLoader from "../components/ui/NeonLoader";

export default function Cart() {
  const { items, init, loading, updateQty, removeItem } = useCartStore();
  const nav = useNavigate();

  useEffect(() => { init(); }, []);

  const subtotal = items.reduce((s, it) => s + (it.product?.price || 0) * it.quantity, 0);

  if (loading) return <NeonLoader />;

  if (!items || items.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl">Your Cart</h2>
        <div className="mt-4 text-zinc-400">No items — <Link to="/products" className="text-neon">Browse products</Link></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {items.map(it => (
          <div key={it.productId} className="flex gap-4 bg-[#0f0f11] p-4 rounded border border-zinc-800">
            <img src={it.product?.images?.[0]?.url || "/mnt/data/06787b30-a3dd-4dff-a854-ffa3134458d7.png"} alt={it.product?.name} className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-semibold">{it.product?.name}</h3>
              <div className="text-sm text-zinc-400">Price: ₹{it.product?.price}</div>
              <div className="mt-2 flex items-center gap-2">
                <button onClick={() => updateQty(it.productId, Math.max(1, it.quantity - 1))} className="px-2 py-1 bg-zinc-800 rounded">-</button>
                <div className="px-3">{it.quantity}</div>
                <button onClick={() => updateQty(it.productId, it.quantity + 1)} className="px-2 py-1 bg-zinc-800 rounded">+</button>
                <button onClick={() => removeItem(it.productId)} className="ml-auto text-sm text-red-400">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#0b0b0d] p-4 rounded border border-zinc-800">
        <h3 className="text-xl">Order Summary</h3>
        <div className="mt-4 flex justify-between"><span>Subtotal</span><strong>₹{subtotal}</strong></div>
        <div className="mt-6">
          <button onClick={() => nav("/checkout")} className="w-full px-4 py-2 bg-neon rounded">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
}
