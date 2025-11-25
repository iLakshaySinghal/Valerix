// src/layouts/StartupLayout.jsx
import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function StartupLayout() {
  const user = useAuthStore((s) => s.user);
  const logoutStore = useAuthStore((s) => s.logout);
  const nav = useNavigate();

  function logout() {
    logoutStore();        // Zustand: clear token + user
    localStorage.clear(); // Extra safety
    nav("/auth/login");
  }

  const linkBase = "block px-3 py-2 rounded-lg transition text-sm";

  const activeClass =
    "bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-[0_0_12px_rgba(0,140,255,0.3)]";

  const inactiveClass =
    "hover:bg-blue-500/15 hover:text-blue-300 text-blue-100/80";

  return (
    <div className="min-h-screen flex bg-[#06070d] text-white">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0a0f2a]/90 border-r border-blue-500/30 
                       shadow-[0_0_25px_rgba(0,136,255,0.3)] hidden md:flex flex-col">
        
        <div className="p-6 border-b border-blue-500/20">
          <h1 className="text-blue-400 text-lg font-bold tracking-wide">
            Startup Dashboard
          </h1>
          <p className="text-xs text-blue-300/70 mt-1">{user?.email}</p>
        </div>

        <nav className="mt-4 flex-1 px-4 space-y-2">

          <NavLink to="/startup"
            className={({ isActive }) => `${linkBase} ${isActive ? activeClass : inactiveClass}`}>
            Home
          </NavLink>

          <NavLink to="/startup/products"
            className={({ isActive }) => `${linkBase} ${isActive ? activeClass : inactiveClass}`}>
            My Products
          </NavLink>

          <NavLink to="/startup/products/add"
            className={({ isActive }) => `${linkBase} ${isActive ? activeClass : inactiveClass}`}>
            Add Product
          </NavLink>

          <NavLink to="/startup/inventory"
            className={({ isActive }) => `${linkBase} ${isActive ? activeClass : inactiveClass}`}>
            Inventory
          </NavLink>

          <NavLink to="/startup/orders"
            className={({ isActive }) => `${linkBase} ${isActive ? activeClass : inactiveClass}`}>
            Orders
          </NavLink>

        </nav>

        <button
          onClick={logout}
          className="m-4 mt-auto px-4 py-2 rounded-lg text-sm bg-red-500/20 text-red-300
                     hover:bg-red-500/30 border border-red-500/30"
        >
          Logout
        </button>

      </aside>

      {/* MAIN SECTION */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR FOR MOBILE */}
        <header className="md:hidden flex justify-between items-center px-4 py-3 
                           bg-[#0a1028]/80 border-b border-blue-500/20 backdrop-blur">
          <h2 className="text-blue-400 font-semibold">Startup Area</h2>
          <button
            onClick={logout}
            className="text-xs px-3 py-1 rounded bg-red-500/30 border border-red-400 text-red-200"
          >
            Logout
          </button>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-4 md:p-6 w-full">
          <div className="rounded-xl bg-[#0b1330]/40 shadow-[0_0_20px_rgba(0,115,255,0.15)]
                          border border-blue-500/20 p-5 min-h-[70vh]">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}
