// src/store/cartStore.js
import { create } from "zustand";
import api from "../utils/api";

// Map backend cart document -> frontend cart array
function mapServerCart(serverCart) {
  if (!serverCart) return [];
  const items = serverCart.items || [];
  return items.map((i) => ({
    productId: i.productId?._id?.toString?.() || i.productId,
    title: i.productId?.name || "",
    price: i.productId?.price || 0,
    qty: i.quantity || 0,
    product: i.productId || null,
  }));
}

export const useCartStore = create((set, get) => ({
  cart: [],
  loading: false,

  // Load current cart from backend
  loadCart: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/cart");
      const serverCart = res.data.cart || res.data;
      set({ cart: mapServerCart(serverCart), loading: false });
    } catch (err) {
      console.error("Failed to load cart", err);
      set({ loading: false });
    }
  },

  // Add quantity to cart (delta)
  addToCart: async (productId, quantity = 1) => {
    try {
      const res = await api.post("/cart/add", { productId, quantity });
      const serverCart = res.data.cart || res.data;
      set({ cart: mapServerCart(serverCart) });
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  },

  // Set absolute quantity for a product
  updateQuantity: async (productId, quantity) => {
    try {
      const res = await api.put("/cart/update", { productId, quantity });
      const serverCart = res.data.cart || res.data;
      set({ cart: mapServerCart(serverCart) });
    } catch (err) {
      console.error("Update qty failed", err);
    }
  },

  // Remove a single product from the cart
  remove: async (productId) => {
    try {
      const res = await api.delete(`/cart/remove/${productId}`);
      const serverCart = res.data.cart || res.data;
      set({ cart: mapServerCart(serverCart) });
    } catch (err) {
      console.error("Remove item failed", err);
    }
  },

  // Clear the entire cart
  clearCart: async () => {
    try {
      const res = await api.delete("/cart/clear");
      const serverCart = res.data.cart || res.data;
      set({ cart: mapServerCart(serverCart) });
    } catch (err) {
      console.error("Clear cart failed", err);
    }
  },
}));
