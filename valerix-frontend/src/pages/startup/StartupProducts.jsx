import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { startupGetProducts, startupDeleteProduct } from "../../api/startup";

export default function StartupProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await startupGetProducts();
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await startupDeleteProduct(id);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  }

  return (
    <div className="space-y-6 text-blue-100">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-blue-300">
          My Products
        </h1>

        <Link
          to="/startup/products/add"
          className="px-4 py-2 text-sm bg-blue-500 text-black rounded-lg
                     hover:bg-blue-400 shadow-[0_0_12px_rgba(0,136,255,0.6)]"
        >
          + Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-blue-300 text-sm">Loading products...</p>
      ) : products.length === 0 ? (
        <div className="text-blue-200 text-sm bg-blue-900/20 p-4 rounded-lg border border-blue-500/20">
          No products added yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {products.map((p) => (
            <div
              key={p._id}
              className="bg-[#0a1028]/60 border border-blue-500/30 rounded-xl p-4
                         shadow-[0_0_15px_rgba(0,115,255,0.25)]
                         hover:border-blue-400 hover:shadow-[0_0_20px_rgba(0,136,255,0.4)]
                         transition"
            >
              {/* Name */}
              <h3 className="text-blue-200 font-medium text-lg">{p.name}</h3>

              {/* Price */}
              <p className="text-blue-300 mt-1 text-sm font-semibold">
                ₹{p.price}
              </p>

              {/* Description */}
              <p className="text-xs text-blue-100/50 mt-2 line-clamp-2">
                {p.description}
              </p>

              {/* Actions */}
              <div className="flex justify-between items-center mt-4">

                <Link
                  to={`/startup/products/${p._id}/edit`}
                  className="px-3 py-1 text-xs rounded bg-blue-500/40
                             hover:bg-blue-500 text-black
                             transition shadow-[0_0_12px_rgba(0,136,255,0.4)]"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteProduct(p._id)}
                  className="px-3 py-1 text-xs rounded bg-red-500/20
                             text-red-300 hover:bg-red-500/30
                             transition border border-red-500/30"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}
