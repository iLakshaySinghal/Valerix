// src/pages/user/UserHome.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";

export default function UserHome() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/products", { params: { limit: 8 } });
      const items = res.data.items || res.data.products || res.data || [];
      setProducts(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-emerald-300">
          Welcome to Valerix
        </h1>
        <p className="text-xs text-emerald-100/70">
          Explore cutting-edge products from verified startups.
        </p>
      </div>

      {/* Products Section */}
      {loading ? (
        <div className="text-sm text-emerald-100/70">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-sm text-gray-400">No products available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          {products.map((p) => (
            <Link
              to={`/user/product/${p._id}`}
              key={p._id}
              className="bg-black/70 border border-emerald-500/30 rounded-xl p-3 
                         hover:border-emerald-400 hover:shadow-[0_0_18px_rgba(16,185,129,0.7)] 
                         transition block"
            >
              {/* Product Image */}
              {p.images?.length > 0 ? (
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-36 object-cover rounded-lg mb-2"
                />
              ) : (
                <div className="w-full h-36 bg-emerald-800/20 rounded-lg mb-2 flex items-center justify-center text-emerald-300 text-xs">
                  No Image
                </div>
              )}

              <div className="font-medium text-emerald-200 line-clamp-1">
                {p.name}
              </div>

              <div className="text-xs text-emerald-300 mt-1">
                ₹{p.price}
              </div>

              <div className="mt-2 text-xs text-gray-400 line-clamp-2">
                {p.description}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
