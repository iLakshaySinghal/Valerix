// src/components/common/Navbar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const THEME_COLORS = {
  green: "from-emerald-500 to-lime-400",
  blue: "from-sky-500 to-cyan-400",
  pink: "from-pink-400 to-rose-300",
};

export default function Navbar({ theme = "green" }) {
  const { user, logout } = useAuthStore();
  const nav = useNavigate();
  const location = useLocation();

  const grad = THEME_COLORS[theme] || THEME_COLORS.green;

  const handleLogout = async () => {
    await logout();
    nav("/auth/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-black/80 border-b border-white/5 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full bg-gradient-to-br ${grad} shadow-[0_0_18px_rgba(0,0,0,0.7)] flex items-center justify-center text-xs font-bold text-black`}
          >
            VX
          </div>
          <span className="font-semibold tracking-wide text-sm md:text-base">
            Valerix
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-xs md:text-sm">
          {/* Basic links depending on role */}
          {user?.role === "admin" && (
            <>
              <Link
                to="/admin"
                className={linkClass(location.pathname.startsWith("/admin"))}
              >
                Admin
              </Link>
            </>
          )}

          {user?.role === "startup" && (
            <>
              <Link
                to="/startup"
                className={linkClass(location.pathname.startsWith("/startup"))}
              >
                Startup
              </Link>
            </>
          )}

          <Link
            to="/"
            className={linkClass(location.pathname === "/" || location.pathname.startsWith("/user"))}
          >
            User
          </Link>

          {user ? (
            <>
              <span className="hidden sm:inline text-xs text-gray-400">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs hover:bg-white/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="px-3 py-1 rounded-full bg-white text-black text-xs font-semibold"
              >
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function linkClass(active) {
  return [
    "px-2 py-1 rounded-full transition",
    active
      ? "bg-white/10 text-white"
      : "text-gray-300 hover:text-white hover:bg-white/5",
  ].join(" ");
}
