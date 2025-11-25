// src/pages/startup/StartupAddProduct.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function StartupAddProduct() {
  const { id } = useParams();
  const nav = useNavigate();

  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) loadProduct();
  }, [id]);

  async function loadProduct() {
    try {
      const res = await api.get(`/startup/products/${id}`);
      const p = res.data.product;

      setForm({
        name: p.name,
        price: p.price,
        stock: p.stock,
        description: p.description,
        category: p.category?._id || "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load product");
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function saveProduct(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await api.put(`/startup/products/${id}`, form);
        alert("Product updated successfully!");
      } else {
        await api.post("/startup/products", form);
        alert("Product created successfully!");
      }

      nav("/startup/products");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold text-blue-300">
        {isEdit ? "Edit Product" : "Add New Product"}
      </h1>

      <form
        onSubmit={saveProduct}
        className="space-y-4 bg-[#0a1028]/60 border border-blue-500/30 
                   rounded-xl p-5 shadow-[0_0_20px_rgba(0,115,255,0.25)]"
      >
        {/* Name */}
        <div>
          <label className="text-xs text-blue-200">Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 bg-[#0b1330]/60 border border-blue-500/30 text-blue-100 rounded-lg"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="text-xs text-blue-200">Price (₹)</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 bg-[#0b1330]/60 border border-blue-500/30 text-blue-100 rounded-lg"
            required
          />
        </div>

        {/* Stock */}
        <div>
          <label className="text-xs text-blue-200">Stock Quantity</label>
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 bg-[#0b1330]/60 border border-blue-500/30 text-blue-100 rounded-lg"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs text-blue-200">Category ID</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 bg-[#0b1330]/60 border border-blue-500/30 text-blue-100 rounded-lg"
            placeholder="Optional — if categories exist"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs text-blue-200">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full mt-1 px-3 py-2 bg-[#0b1330]/60 border border-blue-500/30 text-blue-100 rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-500 text-black rounded-lg font-semibold
                     hover:bg-blue-400 shadow-[0_0_12px_rgba(0,136,255,0.6)]
                     disabled:opacity-60"
        >
          {loading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
}
