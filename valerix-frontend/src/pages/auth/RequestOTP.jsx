import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestOTP } from "../../api/auth";
import NeonLoader from "../../components/ui/NeonLoader";

export default function RequestOTP(){
  const [email,setEmail] = useState("");
  const [phone,setPhone] = useState("");
  const [role,setRole] = useState("user");
  const [loading,setLoading] = useState(false);
  const nav = useNavigate();

  async function onRequest(e){
    e.preventDefault();
    setLoading(true);
    try {
      await requestOTP({ email, phone, role });
      // move to verify page with email in state
      nav("/auth/verify-otp", { state: { email } });
    } catch(err){
      alert(err?.response?.data?.message || err.message || "Failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-[#0b0b0d] rounded border border-zinc-800">
      <h2 className="text-2xl mb-4 text-neon">Login / Signup (OTP)</h2>
      <form onSubmit={onRequest} className="space-y-3">
        <input required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 bg-[#0f0f11] rounded" />
        <input required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone" className="w-full p-2 bg-[#0f0f11] rounded" />
        <select value={role} onChange={e=>setRole(e.target.value)} className="w-full p-2 bg-[#0f0f11] rounded">
          <option value="user">User</option>
          <option value="startup">Startup</option>
          <option value="admin">Admin</option>
        </select>
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-neon rounded">{loading ? <NeonLoader/> : "Request OTP"}</button>
        </div>
      </form>
    </div>
  );
}
