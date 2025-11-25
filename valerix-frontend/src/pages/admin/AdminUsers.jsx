// src/pages/admin/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users || res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  const roleColor = (role) => {
    switch (role) {
      case "admin":
        return "text-red-300 border-red-400/40 bg-red-400/10";
      case "startup":
        return "text-blue-300 border-blue-400/40 bg-blue-400/10";
      default:
        return "text-emerald-300 border-emerald-400/40 bg-emerald-400/10";
    }
  };

  return (
    <div className="space-y-6 text-sm">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-pink-300">
          Users Management
        </h1>
        <p className="text-xs text-pink-100/70">
          All registered users and startup owners on Valerix.
        </p>
      </div>

      {/* Users Table */}
      <div className="rounded-xl bg-black/70 border border-pink-500/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs md:text-sm">
            <thead className="bg-[#1b0f17] border-b border-pink-500/30 text-pink-100/90">
              <tr className="text-left">
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Joined</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colspan="5" className="px-3 py-4 text-center text-pink-200">
                    Loading users…
                  </td>
                </tr>
              ) : !users.length ? (
                <tr>
                  <td colspan="5" className="px-3 py-4 text-center text-pink-200/70">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b border-pink-500/10 hover:bg-white/5 transition"
                  >
                    {/* Name */}
                    <td className="px-3 py-2">{u.name}</td>

                    {/* Email */}
                    <td className="px-3 py-2 text-pink-100/80">
                      {u.email}
                    </td>

                    {/* Phone */}
                    <td className="px-3 py-2 text-pink-100/60">
                      {u.phone || "—"}
                    </td>

                    {/* Role Badge */}
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] border ${roleColor(
                          u.role
                        )}`}
                      >
                        {u.role}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="px-3 py-2 text-pink-100/70">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
