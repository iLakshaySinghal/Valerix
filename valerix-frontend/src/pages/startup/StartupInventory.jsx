import React, { useEffect, useState } from "react";
import { startupGetInventory } from "../../api/startup";
import { adminUpdateInventory, adminGetInventory } from "../../api/admin";

export default function StartupInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [adjustProduct, setAdjustProduct] = useState(null);
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    setLoading(true);
    try {
      // Use startup inventory snapshot (per-startup view), fall back to admin inventory if needed
      const res = await startupGetInventory({ limit: 50, sort: "stock:asc" });
      // backend returns { success, products } for startup inventory
      setItems(res.data.products || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function updateStock(type) {
    if (!adjustProduct || quantity === "") {
      alert("Enter quantity");
      return;
    }

    try {
      if (type === "delta") {
        await adminUpdateInventory({
          productId: adjustProduct._id,
          delta: Number(quantity),
          reason: "manual_adjustment",
        });
      } else {
        await adminUpdateInventory({
          productId: adjustProduct._id,
          delta: 0,
          quantity: Number(quantity),
          reason: "manual_fixed",
        });
      }

      alert("Inventory updated.");
      setAdjustProduct(null);
      setQuantity("");
      loadInventory();
    } catch (err) {
      console.error(err);
      alert("Failed to update stock.");
    }
  }

  return (
    <div className="space-y-6 text-blue-200">
      <h1 className="text-2xl font-semibold text-blue-300">Inventory</h1>

      {loading ? (
        <p className="text-sm">Loading inventory...</p>
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <div
              key={p._id}
              className="bg-[#0b1330]/50 border border-blue-500/30 
                         p-4 rounded-xl shadow-[0_0_20px_rgba(0,115,255,0.15)]"
            >
              <div className="flex justify-between">
                <div>
                  <div className="text-blue-300 font-semibold">{p.name}</div>
                  <div className="text-xs text-blue-200/60 mt-1">
                    Price: ₹{p.price}
                  </div>
                  <div className="text-xs text-blue-200/60">
                    Stock: {p.stock}
                  </div>
                </div>

                <button
                  onClick={() => setAdjustProduct(p)}
                  className="px-3 py-1 text-xs bg-blue-500/30 border border-blue-400 
                             rounded-lg hover:bg-blue-500/40"
                >
                  Adjust
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INVENTORY POPUP */}
      {adjustProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-[#0a1028] p-6 rounded-xl border border-blue-500/40 
                          shadow-[0_0_25px_rgba(0,115,255,0.3)] w-full max-w-sm">
            <h2 className="text-lg font-semibold text-blue-300 mb-4">
              Update Stock → {adjustProduct.name}
            </h2>

            <input
              type="number"
              className="w-full bg-[#0b1330] border border-blue-500/40 rounded-lg 
                         px-3 py-2 text-blue-100 mb-4"
              placeholder="Enter qty (+ or -)"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <div className="flex justify-between gap-3">
              <button
                onClick={() => updateStock("delta")}
                className="flex-1 bg-blue-500 text-black py-2 rounded-lg font-semibold 
                           hover:bg-blue-400"
              >
                Apply Δ
              </button>

              <button
                onClick={() => updateStock("set")}
                className="flex-1 bg-blue-300 text-black py-2 rounded-lg font-semibold 
                           hover:bg-blue-200"
              >
                Set to Exact
              </button>
            </div>

            <button
              onClick={() => setAdjustProduct(null)}
              className="mt-3 text-xs text-blue-400 underline w-full text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
