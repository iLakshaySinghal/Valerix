// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginPassword } from "../../api/auth";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await loginPassword({ email, password });

      // 🔥 SHOW OTP IF BACKEND RETURNS IT (DEV MODE)
      if (res.data?.otp) {
        console.log("🔐 DEV OTP:", res.data.otp);
        alert("DEV OTP: " + res.data.otp);
      }

      // 🔥 Check if backend requires OTP
      if (res.data?.step === "OTP_REQUIRED") {
        nav(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
        return;
      }

      setError("Unexpected response from server.");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
        "Login failed. Check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-orange-300">
        Sign in to Valerix
      </h2>
      <p className="mt-1 text-xs text-zinc-400">
        Enter your credentials. We’ll send an OTP after password verification.
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
            Password
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 rounded-lg bg-black/80 border border-zinc-800 
            text-sm text-zinc-100 focus:outline-none focus:ring-2 
            focus:ring-orange-500 focus:border-orange-500"
            placeholder="•••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
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
          {isSubmitting ? "Verifying…" : "Continue with password"}
        </button>
      </form>

      <div className="mt-4 text-xs text-zinc-400 text-center">
        Don't have an account?{" "}
        <Link
          to="/auth/signup"
          className="text-orange-400 hover:text-orange-300 font-medium"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
