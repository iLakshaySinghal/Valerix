// src/pages/admin/AdminProducts.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Stock modal state
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockProduct, setStockProduct] = useState(null);
  const [stockValue, setStockValue] = useState("");
  const [stockReason, setStockReason] = useState("admin_adjust");
  const [stockSaving, setStockSaving] = useState(false);

  // Logs modal state
  const [logsModalOpen, setLogsModalOpen] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [logsProduct, setLogsProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await api.get("/products", {
        params: {
          q: search || undefined,
          limit: 100,
        },
      });
      const items = res.data.items || res.data.products || res.data || [];
      setProducts(items);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  // Delete product
  async function handleDelete(id) {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  }

  // ---------- STOCK MODAL ----------
  function openStockModal(product) {
    setStockProduct(product);
    setStockValue(
      typeof product.stock === "number" ? String(product.stock) : ""
    );
    setStockReason("admin_adjust");
    setStockModalOpen(true);
  }

  async function saveStock() {
    if (!stockProduct) return;
    const qty = Number(stockValue);
    if (Number.isNaN(qty) || qty < 0) {
      alert("Enter a valid non-negative stock quantity");
      return;
    }

    try {
      setStockSaving(true);
      await api.post("/admin/inventory/set", {
        productId: stockProduct._id,
        quantity: qty,
        reason: stockReason || "admin_adjust",
        refId: null,
      });
      // refresh list
      await loadProducts();
      setStockModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          "Failed to update stock. Check backend route /admin/inventory/set."
      );
    } finally {
      setStockSaving(false);
    }
  }

  // ---------- LOGS MODAL ----------
  async function openLogsModal(product) {
    setLogsProduct(product);
    setLogs([]);
    setLogsModalOpen(true);
    setLogsLoading(true);
    try {
      const res = await api.get(`/admin/inventory/${product._id}/logs`, {
        params: { page: 1, limit: 20 },
      });
      setLogs(res.data.logs || res.data.items || res.data || []);
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          "Failed to load logs. Check backend route /admin/inventory/:productId/logs."
      );
    } finally {
      setLogsLoading(false);
    }
  }

  return (
    <div className="space-y-6 text-sm">
      {/* HEADER + SEARCH */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-pink-300">
            Products & Inventory
          </h1>
          <p className="text-xs text-pink-100/70">
            Manage catalog, see stock and adjust inventory in real-time.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            className="px-3 py-2 rounded-lg bg-black/70 border border-pink-500/40 
                       text-pink-50 placeholder:text-pink-200/40 text-xs
                       focus:outline-none focus:ring-1 focus:ring-pink-400"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={loadProducts}
            className="px-3 py-2 rounded-lg text-xs font-semibold
                       bg-pink-400 text-black shadow-[0_0_12px_rgba(244,114,182,0.8)]
                       hover:brightness-110 transition"
          >
            Apply
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-xl bg-black/70 border border-pink-500/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs md:text-sm">
            <thead className="bg-[#1b0f17] border-b border-pink-500/30 text-pink-100/90">
              <tr className="text-left">
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Startup</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Stock</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-pink-500/10">
                    <td className="px-3 py-3" colSpan={6}>
                      <div className="h-4 rounded bg-pink-500/20 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : !products.length ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-4 text-center text-pink-100/70"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-pink-500/10 hover:bg-pink-500/5 transition"
                  >
                    <td className="px-3 py-2 align-top">
                      <div className="font-medium text-pink-100">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-pink-100/60 line-clamp-2">
                        {p.description}
                      </div>
                    </td>

                    <td className="px-3 py-2 align-top">
                      <div className="text-[12px] text-pink-100/90">
                        {p.startupDetails?.name ||
                          p.startup?.name ||
                          "—"}
                      </div>
                      <div className="text-[11px] text-pink-100/60">
                        {p.startupDetails?.email || p.startup?.email || ""}
                      </div>
                    </td>

                    <td className="px-3 py-2 align-top text-pink-200">
                      ₹{p.price}
                    </td>

                    <td className="px-3 py-2 align-top text-pink-200">
                      {typeof p.stock === "number" ? p.stock : "—"}
                    </td>

                    <td className="px-3 py-2 align-top">
                      {p.stock <= 0 ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] bg-red-500/20 text-red-300 border border-red-500/40">
                          Out of stock
                        </span>
                      ) : p.stock < 5 ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] bg-amber-500/20 text-amber-200 border border-amber-400/40">
                          Low stock
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/15 text-emerald-200 border border-emerald-400/40">
                          In stock
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-2 align-top">
                      <div className="flex flex-col sm:flex-row gap-2 justify-end">
                        <button
                          onClick={() => openStockModal(p)}
                          className="px-3 py-1 rounded-lg text-[11px] 
                                     bg-pink-500/20 border border-pink-400/70 
                                     text-pink-100 hover:bg-pink-500/30"
                        >
                          Adjust stock
                        </button>
                        <button
                          onClick={() => openLogsModal(p)}
                          className="px-3 py-1 rounded-lg text-[11px] 
                                     bg-black/40 border border-pink-400/50 
                                     text-pink-100 hover:bg-black/60"
                        >
                          View logs
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="px-3 py-1 rounded-lg text-[11px] 
                                     bg-red-500/15 border border-red-400/70 
                                     text-red-200 hover:bg-red-500/25"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STOCK MODAL */}
      {stockModalOpen && stockProduct && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md bg-[#150b12] border border-pink-400/40 
                          rounded-xl p-5 shadow-[0_0_25px_rgba(255,100,170,0.4)]">
            <h2 className="text-pink-300 font-semibold text-lg">
              Adjust Stock
            </h2>
            <p className="mt-1 text-[11px] text-pink-100/70">
              {stockProduct.name}
            </p>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block mb-1 text-pink-100/80">
                  New stock quantity
                </label>
                <input
                  type="number"
                  min={0}
                  value={stockValue}
                  onChange={(e) => setStockValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/80 border border-pink-500/50 
                             text-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="block mb-1 text-pink-100/80">
                  Reason (optional)
                </label>
                <input
                  value={stockReason}
                  onChange={(e) => setStockReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/80 border border-pink-500/40 
                             text-pink-50 text-xs focus:outline-none focus:ring-1 focus:ring-pink-400"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setStockModalOpen(false)}
                className="px-3 py-2 rounded-lg bg-black/60 border border-pink-500/40 
                           text-pink-100 hover:bg-black/80"
              >
                Cancel
              </button>
              <button
                onClick={saveStock}
                disabled={stockSaving}
                className="px-4 py-2 rounded-lg bg-pink-400 text-black font-semibold 
                           hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {stockSaving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGS MODAL */}
      {logsModalOpen && logsProduct && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-lg bg-[#150b12] border border-pink-400/40 
                          rounded-xl p-5 shadow-[0_0_25px_rgba(255,100,170,0.4)] max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-pink-300 font-semibold text-lg">
                  Inventory Logs
                </h2>
                <p className="mt-1 text-[11px] text-pink-100/70">
                  {logsProduct.name}
                </p>
              </div>
              <button
                onClick={() => setLogsModalOpen(false)}
                className="text-xs px-3 py-1 rounded-lg bg-black/70 border border-pink-500/40 text-pink-100"
              >
                Close
              </button>
            </div>

            <div className="mt-2 flex-1 overflow-y-auto text-xs space-y-2">
              {logsLoading ? (
                <div className="text-pink-100/80">Loading logs…</div>
              ) : !logs.length ? (
                <div className="text-pink-100/80">No logs found.</div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log._id || `${log.productId}-${log.createdAt}-${log.delta}`}
                    className="border border-pink-500/20 rounded-lg px-3 py-2 bg-black/60"
                  >
                    <div className="flex justify-between">
                      <span className="text-pink-100">
                        Δ {log.delta} → {log.newQuantity}
                      </span>
                      <span className="text-[10px] text-pink-100/70">
                        {log.createdAt &&
                          new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-pink-100/70">
                      Reason: {log.reason || "—"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
