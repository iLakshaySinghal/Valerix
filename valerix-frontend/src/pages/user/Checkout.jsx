// src/pages/user/Checkout.jsx
import React, { useState } from "react";
import api from "../../utils/api";
import { useCartStore } from "../../store/cartStore";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [addressId, setAddressId] = useState("");
  const [loading, setLoading] = useState(false);
  const { cart } = useCartStore();
  const nav = useNavigate();

  const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);

  async function placeOrder() {
    if (!addressId.trim()) {
      alert("Please enter delivery address.");
      return;
    }

    setLoading(true);

    try {
      // Create order
      const res = await api.post("/orders", {
        items: cart.map((i) => ({
          productId: i.productId,
          quantity: i.qty,
        })),
        addressId,
        paymentMethod: "online",
      });

      const orderId = res.data.order?._id || res.data._id;

      // Pay
      await api.post(`/payment/${orderId}/pay`);

      alert("Payment successful! Invoice generated.");
      nav("/user/orders");
    } catch (e) {
      console.error(e);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl text-emerald-300 font-semibold">Checkout</h1>

      <div className="mt-4">
        <textarea
          placeholder="Delivery Address (This will be saved as addressId)"
          className="w-full bg-black/60 border border-emerald-500/40 rounded-lg p-3 text-sm"
          value={addressId}
          onChange={(e) => setAddressId(e.target.value)}
        />

        <div className="mt-4 text-emerald-200 text-lg font-semibold">
          Total Amount: ₹{total}
        </div>

        <button
          onClick={placeOrder}
          disabled={loading}
          className="mt-4 w-full bg-emerald-400 text-black py-2 rounded-lg font-semibold hover:bg-emerald-300"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
