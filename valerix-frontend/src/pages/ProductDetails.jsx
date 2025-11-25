import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import NeonLoader from "../components/ui/NeonLoader";

import { useCartStore } from "../store/useCartStore";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [qty, setQty] = useState(1);

  const { addToCart } = useCartStore();

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.product || res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  if (loading) return <NeonLoader />;
  if (!product) return <div className="p-6">Product not found</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Image Section */}
      <div className="col-span-1">
        <img
          src={product.images?.[0]?.url || "/src/assets/valerix-logo.png"}
          alt={product.name}
          className="w-full h-96 object-cover rounded-xl border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
        />
      </div>

      {/* Details Section */}
      <div className="col-span-2 space-y-4">
        <h1 className="text-3xl font-bold text-cyan-300 drop-shadow-lg">
          {product.name}
        </h1>

        <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
          {product.description}
        </p>

        <div className="text-2xl md:text-3xl font-semibold text-cyan-400 drop-shadow-lg">
          ₹{product.price}
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-3 mt-4">
          <span className="text-sm text-zinc-300">Qty:</span>

          <button
            className="px-3 py-1 bg-slate-800 rounded-md text-cyan-300 hover:bg-slate-700"
            onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
          >
            -
          </button>

          <span className="text-lg font-semibold w-6 text-center">
            {qty}
          </span>

          <button
            className="px-3 py-1 bg-slate-800 rounded-md text-cyan-300 hover:bg-slate-700"
            onClick={() => setQty(qty + 1)}
          >
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => addToCart(product._id, qty)}
          className="
            mt-4 px-6 py-3 rounded-xl font-semibold 
            bg-cyan-500 text-black 
            hover:bg-cyan-400 
            shadow-[0_0_15px_#22d3ee] hover:shadow-[0_0_25px_#22d3ee]
            transition-all
          "
        >
          Add to Cart
        </button>

        {/* Stock Info */}
        <div className="mt-3 text-sm text-zinc-400">
          {product.stock > 0 ? (
            <span className="text-green-400">In Stock</span>
          ) : (
            <span className="text-red-400">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
}
