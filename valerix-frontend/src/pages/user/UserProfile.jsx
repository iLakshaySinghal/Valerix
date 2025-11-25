// src/pages/user/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../api/user";

export default function UserProfile() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const r = await getProfile();
    setForm(r.data.profile);
    setLoading(false);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function save() {
    await updateProfile(form);
    alert("Profile updated!");
  }

  if (loading) return <p className="text-green-200">Loading...</p>;

  return (
    <div className="text-green-200">
      <h2 className="text-xl font-bold text-green-300">My Profile</h2>

      <div className="grid gap-4 mt-5 max-w-md">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="px-3 py-2 rounded-lg bg-black/70 border border-green-500/40 text-sm"
          placeholder="Full Name"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="px-3 py-2 rounded-lg bg-black/70 border border-green-500/40 text-sm"
          placeholder="Phone"
        />

        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          className="px-3 py-2 rounded-lg bg-black/70 border border-green-500/40 text-sm"
          placeholder="Address"
        />

        <button
          onClick={save}
          className="px-4 py-2 bg-green-600 text-black rounded-lg hover:bg-green-500"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
