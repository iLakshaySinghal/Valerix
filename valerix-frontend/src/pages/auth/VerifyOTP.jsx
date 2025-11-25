// src/pages/auth/VerifyOtp.jsx
import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { verifyOtp } from "../../api/auth";
import { useAuthStore } from "../../store/useAuthStore";

export default function VerifyOtp() {
  const nav = useNavigate();
  const [search] = useSearchParams();
  const initialEmail = search.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const setAuth = useAuthStore((s) => s.setAuth);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !otp) {
      setError("Email and OTP are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await verifyOtp({ email, otp });

      const user = res.data.user || res.data?.user;
      const token = res.data.token || res.data?.token;

      if (!user || !token) {
        throw new Error("Invalid server response.");
      }

      setAuth(user, token);

      // Route by role
      const role = user.role;
      if (role === "admin") nav("/admin", { replace: true });
      else if (role === "startup") nav("/startup", { replace: true });
      else nav("/user", { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-orange-300">
        Verify OTP
      </h2>
      <p className="mt-1 text-xs text-zinc-400">
        We&apos;ve sent a one-time password to your registered email.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
        <div>
          <label className="block text-xs mb-1 text-zinc-300">
            Email
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 rounded-lg bg-black/80 border border-zinc-800 
                       text-sm text-zinc-100 focus:outline-none focus:ring-2 
                       focus:ring-orange-500 focus:border-orange-500"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-xs mb-1 text-zinc-300">
            OTP
          </label>
          <input
            type="text"
            maxLength={6}
            className="w-full px-3 py-2 rounded-lg bg-black/80 border border-zinc-800 
                       text-sm tracking-[0.35em] text-center text-zinc-100 
                       focus:outline-none focus:ring-2 
                       focus:ring-orange-500 focus:border-orange-500"
            placeholder="••••••"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-2.5 rounded-lg text-sm font-semibold 
                     bg-gradient-to-r from-orange-500 to-amber-400 text-black
                     shadow-[0_0_18px_rgba(251,146,60,0.7)]
                     hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed
                     transition-all"
        >
          {isSubmitting ? "Verifying OTP…" : "Verify & Continue"}
        </button>
      </form>

      <div className="mt-4 text-xs text-zinc-400 text-center">
        Entered wrong credentials?{" "}
        <Link
          to="/auth/login"
          className="text-orange-400 hover:text-orange-300 font-medium"
        >
          Go back to login
        </Link>
      </div>
    </div>
  );
}
