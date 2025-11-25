// src/layouts/AdminLayout.jsx
import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function AdminLayout() {
  const { user, clearAuth } = useAuthStore();
  const nav = useNavigate();

  function logout() {
    clearAuth();
    localStorage.clear();
    nav("/auth/login");
  }

  return (
    <div className="min-h-screen flex bg-[#0a0a0c] text-white">

      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-[#1b0f17]/90 border-r border-pink-500/30 
                         shadow-[0_0_25px_rgba(255,110,180,0.25)] hidden md:flex flex-col">

        <div className="p-6 border-b border-pink-500/20">
          <h1 className="text-pink-400 text-lg font-bold">Admin Panel</h1>
          <p className="text-xs text-pink-300/70">{user?.email}</p>
        </div>

        <nav className="mt-4 flex-1 px-4 space-y-2 text-sm">

          <Link
            to="/admin"
            className="block px-3 py-2 rounded-lg hover:bg-pink-500/20 hover:text-pink-300"
          >
            Dashboard Overview
          </Link>

          <Link
            to="/admin/products"
            className="block px-3 py-2 rounded-lg hover:bg-pink-500/20 hover:text-pink-300"
          >
            All Products
          </Link>

          <Link
            to="/admin/orders"
            className="block px-3 py-2 rounded-lg hover:bg-pink-500/20 hover:text-pink-300"
          >
            Orders
          </Link>

          <Link
            to="/admin/users"
            className="block px-3 py-2 rounded-lg hover:bg-pink-500/20 hover:text-pink-300"
          >
            Users
          </Link>

          <Link
            to="/admin/inventory"
            className="block px-3 py-2 rounded-lg hover:bg-pink-500/20 hover:text-pink-300"
          >
            Inventory
          </Link>

        </nav>

        <button
          onClick={logout}
          className="m-4 mt-auto px-4 py-2 rounded-lg text-sm bg-red-500/20 
                     text-red-300 hover:bg-red-500/30 border border-red-500/30"
        >
          Logout
        </button>
      </aside>

      {/* RIGHT SIDE: TOP NAV + PAGE CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* MOBILE TOPBAR */}
        <header className="md:hidden flex justify-between items-center px-4 py-3 
                           bg-[#160c14]/80 border-b border-pink-500/25 backdrop-blur">
          <h2 className="text-pink-400 font-semibold">Admin Area</h2>

          <button
            onClick={logout}
            className="text-xs px-3 py-1 rounded bg-red-500/30 border border-red-400 text-red-200"
          >
            Logout
          </button>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-4 md:p-6 w-full">
          <div className="rounded-xl bg-[#150b12]/40 shadow-[0_0_20px_rgba(255,100,170,0.2)]
                          border border-pink-500/20 p-5 min-h-[70vh]">

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
