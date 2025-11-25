// src/store/cartStore.js
import { create } from "zustand";
import api from "../utils/api";

export const useCartStore = create((set, get) => ({
  items: [],
  loading: false,

  loadCart: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/cart");
      set({ items: res.data.items || [], loading: false });
    } catch (err) {
      console.error("Failed to load cart", err);
      set({ loading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      const res = await api.post("/cart", { productId, quantity });
      set({ items: res.data.items || [] });
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      const res = await api.put("/cart", { productId, quantity });
      set({ items: res.data.items || [] });
    } catch (err) {
      console.error("Update qty failed", err);
    }
  },

  removeItem: async (productId) => {
    try {
      const res = await api.delete(`/cart/${productId}`);
      set({ items: res.data.items || [] });
    } catch (err) {
      console.error("Remove item failed", err);
    }
  },

  clearCart: async () => {
    try {
      await api.delete("/cart");
      set({ items: [] });
    } catch (err) {
      console.error("Clear cart failed", err);
    }
  },
}));
