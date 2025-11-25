// src/layouts/UserLayout.jsx
import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function UserLayout() {
  const { user, clearAuth } = useAuthStore();
  const nav = useNavigate();

  function logout() {
    clearAuth();
    localStorage.clear();
    nav("/auth/login");
  }

  return (
    <div className="min-h-screen flex bg-[#060b06] text-white">

      {/* SIDEBAR (desktop) */}
      <aside className="hidden md:flex w-60 flex-col bg-[#0d130d]/90 border-r
                         border-green-500/30 shadow-[0_0_25px_rgba(50,255,120,0.2)]">

        <div className="p-5 border-b border-green-500/20">
          <h1 className="text-green-400 text-lg font-bold">
            Valerix — User Panel
          </h1>
          <p className="text-xs text-green-300/60">{user?.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 text-sm">

          <Link
            to="/user"
            className="block px-3 py-2 rounded-lg hover:bg-green-500/20 hover:text-green-300"
          >
            Home
          </Link>

          <Link
            to="/user/products"
            className="block px-3 py-2 rounded-lg hover:bg-green-500/20 hover:text-green-300"
          >
            Browse Products
          </Link>

          <Link
            to="/user/cart"
            className="block px-3 py-2 rounded-lg hover:bg-green-500/20 hover:text-green-300"
          >
            Cart
          </Link>

          <Link
            to="/user/orders"
            className="block px-3 py-2 rounded-lg hover:bg-green-500/20 hover:text-green-300"
          >
            My Orders
          </Link>

          <Link
            to="/user/profile"
            className="block px-3 py-2 rounded-lg hover:bg-green-500/20 hover:text-green-300"
          >
            Profile
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

      {/* RIGHT SECTION */}
      <div className="flex-1 flex flex-col">

        {/* MOBILE TOPBAR */}
        <header className="md:hidden flex justify-between items-center px-4 py-3
                           bg-[#0c120c]/80 border-b border-green-500/25 backdrop-blur">
          <h2 className="text-green-400 font-semibold text-sm">User Dashboard</h2>

          <button
            onClick={logout}
            className="text-xs px-3 py-1 rounded bg-red-500/30 border border-red-400 text-red-200"
          >
            Logout
          </button>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-4 md:p-6">
          <div className="rounded-xl bg-[#0c160c]/40 shadow-[0_0_20px_rgba(50,255,120,0.2)]
                           border border-green-500/20 p-5 min-h-[70vh]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
