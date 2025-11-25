import React, { useEffect, useState } from "react";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import NeonLoader from "../components/ui/NeonLoader";

export default function ProductList({ compact }) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  // Filters
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [page, category, min, max, sort]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await api.get("/products", {
        params: {
          page,
          search: q || undefined,
          category: category || undefined,
          minPrice: min || undefined,
          maxPrice: max || undefined,
          sort,
        },
      });

      setItems(res.data.items || res.data.products || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Client-side search as fallback
  const filteredList = q
    ? items.filter((p) =>
        p.name?.toLowerCase().includes(q.toLowerCase())
      )
    : items;

  return (
    <div className="space-y-4">

      {/* ------------------ FILTER BAR ------------------ */}
      <div className="bg-black/60 border border-cyan-500/20 rounded-xl p-4 shadow-[0_0_18px_rgba(34,211,238,0.25)]">

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">

          {/* Search */}
          <input
            placeholder="Search..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="p-2 rounded-lg bg-black/70 border border-slate-700 text-white placeholder-zinc-500"
          />

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 rounded-lg bg-black/70 border border-slate-700 text-white"
          >
            <option value="">All Categories</option>
            <option value="tech">Tech</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home</option>
            <option value="fitness">Fitness</option>
            <option value="beauty">Beauty</option>
          </select>

          {/* Min Price */}
          <input
            type="number"
            placeholder="Min ₹"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="p-2 rounded-lg bg-black/70 border border-slate-700 text-white placeholder-zinc-500"
          />

          {/* Max Price */}
          <input
            type="number"
            placeholder="Max ₹"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="p-2 rounded-lg bg-black/70 border border-slate-700 text-white placeholder-zinc-500"
          />

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="p-2 rounded-lg bg-black/70 border border-slate-700 text-white"
          >
            <option value="">Sort</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="latest">Latest</option>
          </select>

          {/* Apply Button */}
          <button
            onClick={fetchProducts}
            className="px-4 py-2 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 font-semibold shadow-[0_0_10px_#22d3ee]"
          >
            Apply
          </button>

        </div>
      </div>

      {/* ------------------ PRODUCTS ------------------ */}
      {loading ? (
        <NeonLoader />
      ) : (
        <div
          className={`grid ${
            compact
              ? "grid-cols-2 sm:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-3 md:grid-cols-4"
          } gap-4`}
        >
          {filteredList.map((p) => (
            <ProductCard key={p._id || p.id} product={p} />
          ))}
        </div>
      )}

      {/* ------------------ Pagination ------------------ */}
      <div className="flex justify-center gap-4 mt-6">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 rounded-lg bg-black/60 border border-cyan-500/30 text-cyan-300 hover:bg-black/70 disabled:opacity-30"
        >
          Prev
        </button>

        <span className="text-cyan-300 font-semibold text-lg">{page}</span>

        <button
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 rounded-lg bg-black/60 border border-cyan-500/30 text-cyan-300 hover:bg-black/70"
        >
          Next
        </button>

      </div>
    </div>
  );
}
