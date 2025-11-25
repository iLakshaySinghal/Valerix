// src/pages/auth/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../../api/auth";

export default function Signup() {
  const nav = useNavigate();
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [startupName, setStartupName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password || !name) {
      setError("Name, email and password are required.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      // SIGNUP (backend does NOT accept startupName here)
      await signup({
        name,
        email,
        phone,
        role,
        password,
      });

      // redirect to profile creation instead of login
      if (role === "startup") {
        nav("/startup/profile/create");
      } else {
        nav("/user/profile/create");
      }

    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Signup failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-orange-300">
        Create your Valerix account
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">

        <div>
          <label className="block text-xs mb-1 text-zinc-300">Role</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`flex-1 py-2 text-xs rounded-lg border ${
                role === "user"
                  ? "border-orange-500 bg-orange-500/20 text-orange-200 shadow-[0_0_10px_rgba(251,146,60,0.7)]"
                  : "border-zinc-700 bg-black/70 text-zinc-300"
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setRole("startup")}
              className={`flex-1 py-2 text-xs rounded-lg border ${
                role === "startup"
                  ? "border-orange-500 bg-orange-500/20 text-orange-200 shadow-[0_0_10px_rgba(251,146,60,0.7)]"
                  : "border-zinc-700 bg-black/70 text-zinc-300"
              }`}
            >
              Startup
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs mb-1 text-zinc-300">
            {role === "startup" ? "Founder name" : "Full name"}
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-black/80 border border-zinc-800 
                       text-sm text-zinc-100 focus:outline-none focus:ring-2 
                       focus:ring-orange-500 focus:border-orange-500"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {role === "startup" && (
          <div>
            <label className="block text-xs mb-1 text-zinc-300">
              Startup / Brand name
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg bg-black/80 border border-zinc-800 
                         text-sm text-zinc-100 focus:outline-none focus:ring-2 
                         focus:ring-orange-500 focus:border-orange-500"
              placeholder="Valerix Labs"
              value={startupName}
              onChange={(e) => setStartupName(e.target.value)}
            />
          </div>
        )}

        <div>
          <label className="block text-xs mb-1 text-zinc-300">Phone</label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-black/80 border border-zinc-800 
                       text-sm text-zinc-100 focus:outline-none focus:ring-2 
                       focus:ring-orange-500 focus:border-orange-500"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs mb-1 text-zinc-300">Email</label>
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

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs mb-1 text-zinc-300">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-lg bg-black/80 border border-zinc-800 
                         text-sm text-zinc-100 focus:outline-none focus:ring-2 
                         focus:ring-orange-500 focus:border-orange-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-xs mb-1 text-zinc-300">Confirm</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-lg bg-black/80 border border-zinc-800 
                         text-sm text-zinc-100 focus:outline-none focus:ring-2 
                         focus:ring-orange-500 focus:border-orange-500"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>
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
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <div className="mt-4 text-xs text-zinc-400 text-center">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="text-orange-400 hover:text-orange-300 font-medium"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
