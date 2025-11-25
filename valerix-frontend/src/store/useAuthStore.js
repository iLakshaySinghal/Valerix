// src/store/useAuthStore.js
import { create } from "zustand";
import { me } from "../api/auth";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  loading: true,

  // Initialize auth from localStorage + /auth/me
  initAuth: async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token) {
        set({ loading: false, user: null, token: null });
        return;
      }

      set({ token, loading: true });

      // Optional: trust local user first, then refresh from backend
      if (storedUser) {
        set({ user: JSON.parse(storedUser) });
      }

      const res = await me();
      const user = res.data.user || res.data;
      set({ user, loading: false });

      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      console.error("Auth init failed:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ user: null, token: null, loading: false });
    }
  },

  // Set user + token after OTP verify
  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, token });
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },
}));
