// src/layouts/AuthLayout.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-[#050507] text-white">
      
      {/* LEFT SIDE */}
      <div className="hidden lg:flex flex-col justify-between p-10 w-1/2
                      bg-gradient-to-br from-black via-[#120707] to-[#ff7a18]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl border border-orange-400/60 
                            flex items-center justify-center text-xl font-bold 
                            text-orange-300 shadow-[0_0_18px_rgba(251,146,60,0.9)]">
              V
            </div>
            <span className="text-2xl font-bold tracking-wide text-orange-300">
              Valerix
            </span>
          </Link>

          <h1 className="mt-10 text-4xl font-semibold text-orange-100 leading-tight">
            Secure access <br /> to your Valerix world.
          </h1>

          <p className="mt-4 text-sm text-orange-100/80 max-w-md">
            Login with password, verify OTP, and manage your startup,
            store, and admin operations from one place.
          </p>
        </div>

        <div className="text-xs text-orange-100/60">
          Multi-factor login • Role-aware dashboards • Real-time inventory sync
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-10">
        <div className="w-full max-w-md">

          <div className="mb-6 lg:hidden flex items-center justify-center gap-2">
            <div className="h-9 w-9 rounded-xl border border-orange-400/60 
                            flex items-center justify-center text-lg font-bold 
                            text-orange-300 shadow-[0_0_12px_rgba(251,146,60,0.9)]">
              V
            </div>
            <span className="text-xl font-semibold text-orange-300">
              Valerix
            </span>
          </div>

          <div className="bg-black/70 border border-orange-500/30 
                          rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(251,146,60,0.35)]">
            <Outlet />
          </div>

          <div className="mt-4 text-[11px] text-center text-zinc-400">
            Protected by OTP + password. Do not share your credentials.
          </div>

        </div>
      </div>

    </div>
  );
}
