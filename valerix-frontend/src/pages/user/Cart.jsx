// src/pages/user/Cart.jsx
import React, { useEffect } from "react";
import { useCartStore } from "../../store/cartStore";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, loadCart, updateQuantity, remove } = useCartStore();

  useEffect(() => {
    loadCart();
  }, []);

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (!cart.length)
    return <div className="text-sm text-emerald-100">Your cart is empty.</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-emerald-300">Your Cart</h1>

      {cart.map((item) => (
        <div
          key={item.productId}
          className="bg-black/70 border border-emerald-500/40 rounded-xl p-4 flex justify-between"
        >
          <div>
            <h3 className="text-emerald-200">{item.title}</h3>
            <p className="text-xs text-gray-400">₹{item.price}</p>

            <div className="flex gap-2 mt-2 items-center">
              {/* Decrease */}
              <button
                onClick={() =>
                  updateQuantity(item.productId, Math.max(1, item.qty - 1))
                }
                className="px-2 py-1 bg-emerald-500 text-black rounded"
              >
                -
              </button>

              <span className="text-sm">{item.qty}</span>

              {/* Increase */}
              <button
                onClick={() =>
                  updateQuantity(item.productId, item.qty + 1)
                }
                className="px-2 py-1 bg-emerald-500 text-black rounded"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => remove(item.productId)}
            className="text-red-400 text-xs hover:text-red-300"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="text-right text-emerald-200 text-lg font-semibold">
        Total: ₹{total}
      </div>

      <Link
        to="/user/checkout"
        className="block bg-emerald-400 text-black py-2 rounded-lg text-center font-semibold hover:bg-emerald-300"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
