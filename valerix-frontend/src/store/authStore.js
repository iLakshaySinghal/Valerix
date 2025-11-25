// src/store/authStore.js
import { create } from "zustand";
import api from "../utils/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  loading: false,

  // Initialise from localStorage and /auth/me
  initAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    set({ loading: true });
    try {
      const res = await api.get("/auth/me");
      set({ user: res.data.user, token, loading: false });
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      console.error("Auth init failed:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ user: null, token: null, loading: false });
    }
  },

  setAuth: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user });
  },

  logout: async () => {
    try {
      // Backend logout if you have it
      await api.post("/auth/logout").catch(() => {});
    } catch (_) {}

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null });
  },
}));
