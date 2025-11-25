import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import NeonLoader from "../../components/ui/NeonLoader";

export default function Categories(){
  const [list,setList] = useState([]);
  const [name,setName] = useState("");
  const [loading,setLoading] = useState(true);

  useEffect(()=>{ load(); }, []);

  async function load(){
    setLoading(true);
    try {
      const res = await api.get("/categories");
      setList(res.data.categories || res.data);
    } catch(e){ console.error(e); }
    setLoading(false);
  }

  async function create(){
    if(!name) return;
    try {
      await api.post("/categories", { name });
      setName("");
      load();
    } catch(e){ alert("Failed"); }
  }

  async function remove(id){
    if(!confirm("Delete?")) return;
    try { await api.delete(`/categories/${id}`); load(); } catch(e){ alert("Failed"); }
  }

  if (loading) return <NeonLoader />;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl text-neon mb-3">Categories</h2>
      <div className="bg-[#0b0b0d] p-4 rounded border border-zinc-800 mb-4">
        <div className="flex gap-2">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Category name" className="flex-1 p-2 bg-[#0f0f11] rounded" />
          <button onClick={create} className="px-3 py-1 bg-neon rounded">Create</button>
        </div>
      </div>

      <div className="space-y-2">
        {list.map(c => (
          <div key={c._id} className="bg-[#0f0f11] p-3 rounded border border-zinc-800 flex justify-between">
            <div>{c.name}</div>
            <div><button onClick={()=>remove(c._id)} className="text-sm text-red-400">Delete</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
