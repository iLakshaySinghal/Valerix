// src/api/auth.js
import api from "../utils/api";

export const signup = (payload) =>
  api.post("/auth/signup", payload);

export const loginPassword = (payload) =>
  api.post("/auth/login", payload);

export const verifyOtp = (payload) =>
  api.post("/auth/verify-login-otp", payload);

// ✔ FIX: export me() properly
export const me = () =>
  api.get("/auth/me");

export const logout = () =>
  api.post("/auth/logout");
