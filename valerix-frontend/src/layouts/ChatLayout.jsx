// src/layouts/ChatLayout.jsx
import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function ChatLayout() {
  const { user, clearAuth } = useAuthStore();
  const nav = useNavigate();

  function logout() {
    clearAuth();
    localStorage.clear();
    nav("/auth/login");
  }

  return (
    <div className="min-h-screen flex bg-black text-white">

      {/* LEFT SIDEBAR */}
      <aside
        className="w-64 bg-black/40 border-r border-gray-800
                   backdrop-blur-xl hidden md:flex flex-col"
      >
        <div className="p-5 border-b border-gray-800">
          <h1 className="text-lg font-semibold text-white">Chats</h1>
          <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
        </div>

        <nav className="mt-4 flex-1 px-4 space-y-2 text-sm">
          <Link
            to="/chat"
            className="block px-3 py-2 rounded-lg hover:bg-white/10 transition"
          >
            My Chats
          </Link>

          <Link
            to="/chat/create"
            className="block px-3 py-2 rounded-lg hover:bg-white/10 transition"
          >
            New Chat
          </Link>

          <Link
            to="/"
            className="block px-3 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Back to Dashboard
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

      {/* MAIN CHAT PAGE */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR (mobile) */}
        <header className="md:hidden flex justify-between items-center px-4 py-3
                           bg-black/60 border-b border-gray-800 backdrop-blur-xl">
          <h2 className="text-white font-semibold">Chat</h2>
          <button
            onClick={logout}
            className="text-xs px-3 py-1 rounded bg-red-500/30 
                       border border-red-400 text-red-200"
          >
            Logout
          </button>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-4 md:p-6">
          <div
            className="rounded-xl bg-black/40 backdrop-blur-xl
                       border border-gray-800 shadow-[0_0_20px_rgba(255,255,255,0.05)]
                       p-4 min-h-[70vh]"
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
