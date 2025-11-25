// src/pages/admin/AdminInventory.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/api";

export default function AdminInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [delta, setDelta] = useState("");
  const [operation, setOperation] = useState("add"); // add / reduce / set

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/admin/inventory", {
        params: { q: query },
      });
      setItems(res.data.items || res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }

  async function updateStock() {
    if (!selected || delta === "") {
      alert("Select a product and enter a value");
      return;
    }

    try {
      let payload = { productId: selected._id };

      if (operation === "set") {
        payload.quantity = Number(delta);
        await api.post("/admin/inventory/set", payload);
      } else {
        payload.delta = operation === "add" ? Number(delta) : -Number(delta);
        await api.post("/admin/inventory/update", payload);
      }

      alert("Inventory updated");
      setDelta("");
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to update inventory");
    }
  }

  return (
    <div className="space-y-6 text-sm">

      {/* ------------------ HEADER ------------------ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-pink-300">
            Inventory Management
          </h1>
          <p className="text-xs text-pink-100/70">
            Manage stock levels for all startup products.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          className="px-3 py-2 rounded-lg bg-black/60 border border-pink-500/30 
                     text-pink-200 placeholder-pink-300/40 focus:ring-2 
                     focus:ring-pink-500 text-xs"
        />
      </div>

      {/* ------------------ TABLE ------------------ */}
      <div className="rounded-xl bg-black/70 border border-pink-500/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm border-collapse">
            <thead className="bg-[#1b0f17] border-b border-pink-500/30 text-pink-200/90">
              <tr className="text-left">
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Startup</th>
                <th className="px-3 py-2">Stock</th>
                <th className="px-3 py-2">Sold</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-pink-200">
                    Loading…
                  </td>
                </tr>
              ) : !items.length ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-pink-200/70">
                    No inventory records found.
                  </td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-pink-500/10 hover:bg-white/5 transition"
                  >
                    <td className="px-3 py-2 text-pink-100">{p.name}</td>

                    <td className="px-3 py-2 text-pink-200/80">
                      {p.startupDetails?.name || "N/A"}
                    </td>

                    <td className="px-3 py-2 text-pink-300 font-semibold">
                      {p.stock}
                    </td>

                    <td className="px-3 py-2 text-pink-200/80">
                      {p.salesCount || 0}
                    </td>

                    <td className="px-3 py-2 text-pink-300">
                      ₹{p.price}
                    </td>

                    <td className="px-3 py-2">
                      <button
                        onClick={() => setSelected(p)}
                        className="px-3 py-1 text-[11px] rounded-lg 
                                   bg-pink-500/20 border border-pink-400/40 
                                   text-pink-200 hover:bg-pink-500/30"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* ------------------ UPDATE MODAL ------------------ */}
      {selected && (
        <div className="p-4 rounded-xl bg-black/60 border border-pink-500/30 shadow-lg">
          <h3 className="text-pink-300 font-semibold mb-2">
            Update Stock — {selected.name}
          </h3>

          <div className="flex flex-wrap gap-3 text-xs">

            <select
              className="px-3 py-2 bg-black/70 border border-pink-500/30 rounded-lg"
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
            >
              <option value="add">Add Stock</option>
              <option value="reduce">Reduce Stock</option>
              <option value="set">Set Exact Quantity</option>
            </select>

            <input
              type="number"
              placeholder="Value"
              className="px-3 py-2 w-24 bg-black/70 border border-pink-500/30 rounded-lg text-pink-200"
              value={delta}
              onChange={(e) => setDelta(e.target.value)}
            />

            <button
              onClick={updateStock}
              className="px-4 py-2 bg-pink-500 text-black rounded-lg font-semibold hover:bg-pink-400"
            >
              Apply
            </button>

            <button
              onClick={() => setSelected(null)}
              className="px-3 py-2 border border-pink-500/40 text-pink-300 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
