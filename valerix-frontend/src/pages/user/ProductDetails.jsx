import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import { useCartStore } from "../../store/cartStore";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCartStore();
  const [product, setProduct] = useState(null);

  useEffect(() => { load(); }, [id]);

  async function load() {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.product || res.data);
    } catch (err) {
      console.error(err);
    }
  }

  if (!product) return <div className="text-sm">Loading...</div>;

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold text-emerald-300">
        {product.name}
      </h1>

      <div className="bg-black/70 border border-emerald-500/40 rounded-xl p-4">
        <p className="text-emerald-200 text-lg font-semibold">
          ₹{product.price}
        </p>

        <p className="mt-3 text-sm text-emerald-100/70">
          {product.description}
        </p>

        <button
          onClick={() => addToCart(product._id, 1)}
          className="mt-4 w-full bg-emerald-400 text-black py-2 rounded-lg font-semibold hover:bg-emerald-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
