import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res = await api.get("/products");
      setItems(res.data.items || res.data.products || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="text-emerald-200 text-sm">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-emerald-300">Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((p) => (
          <Link
            to={`/user/product/${p._id}`}
            key={p._id}
            className="bg-black/70 border border-emerald-500/40 rounded-xl p-4 hover:border-emerald-400 transition"
          >
            <h3 className="text-emerald-200 font-medium">{p.name}</h3>
            <p className="text-sm text-emerald-100/70 mt-1">
              ₹{p.price}
            </p>
            <p className="text-xs text-gray-400 mt-2 line-clamp-2">
              {p.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
