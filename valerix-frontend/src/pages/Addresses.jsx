import React, { useEffect, useState } from "react";
import api from "../utils/api";
import NeonLoader from "../components/ui/NeonLoader";

export default function Addresses(){
  const [list,setList] = useState([]);
  const [loading,setLoading] = useState(true);
  const [form,setForm] = useState({ line1:"", city:"", state:"", pincode:"", country:"India" });

  useEffect(()=>{ load(); }, []);

  async function load(){
    setLoading(true);
    try {
      const res = await api.get("/address");
      setList(res.data.list || []);
    } catch(e){ console.error(e); }
    setLoading(false);
  }

  async function add(){
    try {
      await api.post("/address", form);
      setForm({ line1:"", city:"", state:"", pincode:"", country:"India" });
      load();
    } catch(e){ alert("Failed"); }
  }

  async function remove(id){
    if (!confirm("Remove address?")) return;
    try { await api.delete(`/address/${id}`); load(); } catch(e){ alert("Failed"); }
  }

  if (loading) return <NeonLoader />;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl text-neon">My Addresses</h2>
      <div className="bg-[#0b0b0d] p-4 rounded border border-zinc-800">
        <input value={form.line1} onChange={e=>setForm({...form, line1:e.target.value})} placeholder="Address line 1" className="w-full p-2 bg-[#0f0f11] rounded mb-2" />
        <div className="grid grid-cols-2 gap-2">
          <input value={form.city} onChange={e=>setForm({...form, city:e.target.value})} placeholder="City" className="p-2 bg-[#0f0f11] rounded" />
          <input value={form.state} onChange={e=>setForm({...form, state:e.target.value})} placeholder="State" className="p-2 bg-[#0f0f11] rounded" />
        </div>
        <div className="flex gap-2 mt-2">
          <input value={form.pincode} onChange={e=>setForm({...form, pincode:e.target.value})} placeholder="Pincode" className="p-2 bg-[#0f0f11] rounded" />
          <input value={form.country} onChange={e=>setForm({...form, country:e.target.value})} placeholder="Country" className="p-2 bg-[#0f0f11] rounded" />
          <button onClick={add} className="px-3 py-1 bg-neon rounded">Add</button>
        </div>
      </div>

      <div className="space-y-3">
        {list.map(a => (
          <div key={a._id} className="bg-[#0f0f11] p-3 rounded border border-zinc-800 flex justify-between items-center">
            <div>
              <div className="font-medium">{a.line1}</div>
              <div className="text-sm text-zinc-400">{a.city}, {a.state} - {a.pincode}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>remove(a._id)} className="text-sm text-red-400">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
