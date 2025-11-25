import React, { useEffect, useState } from "react";
import client from "../../api/client.js";

/*
 This component communicates with backend endpoints:
 - GET /startup/products?mine=true
 - POST /startup/products
 - PUT /startup/products/:id
 - DELETE /startup/products/:id
*/

export default function ProductsCRUD() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await client.get("/startup/products", { params: { mine: true } });
      setItems(res.data.products || []);
    } catch (e) {
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete product?")) return;
    await client.delete(`/startup/products/${id}`);
    load();
  };

  const save = async (payload) => {
    if (editing) {
      await client.put(`/startup/products/${editing.id}`, payload);
    } else {
      await client.post("/startup/products", payload);
    }
    setEditing(null);
    load();
  };

  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold">Products</h3>
        <div className="mt-2">
          {loading ? (
            <div>Loading...</div>
          ) : (
            items.map((p) => (
              <div key={p.id} className="bg-[rgba(6,16,23,0.6)] p-3 rounded my-2 flex justify-between">
                <div>{p.title}</div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(p)} className="underline">Edit</button>
                  <button onClick={() => remove(p.id)} className="underline">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold">Create / Edit</h3>
        <ProductForm initial={editing} onSave={save} onCancel={() => setEditing(null)} />
      </div>
    </div>
  );
}

function ProductForm({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [price, setPrice] = useState(initial?.price || 0);
  const [desc, setDesc] = useState(initial?.description || "");
  const [image, setImage] = useState(initial?.image || "");

  useEffect(() => {
    setTitle(initial?.title || "");
    setPrice(initial?.price || 0);
    setDesc(initial?.description || "");
    setImage(initial?.image || "");
  }, [initial]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ title, price, description: desc, image }); }} className="mt-2 flex flex-col gap-2">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="p-2 rounded bg-[rgba(7,16,24,0.4)]" />
      <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="Price" className="p-2 rounded bg-[rgba(7,16,24,0.4)]" />
      <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" className="p-2 rounded bg-[rgba(7,16,24,0.4)]" />
      <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" className="p-2 rounded bg-[rgba(7,16,24,0.4)]" />
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 rounded bg-[var(--accent)] text-black">Save</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">Cancel</button>
      </div>
    </form>
  );
}
