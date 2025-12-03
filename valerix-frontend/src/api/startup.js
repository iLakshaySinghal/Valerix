import api from "../utils/api";

// STARTUP DASHBOARD / STATS
export const getStartupStats = () => api.get("/startup/stats");

// STARTUP PRODUCTS via /api/startup/products (controller-based)
export const startupGetProducts = () => api.get("/startup/products");
export const startupCreateProduct = (data) => api.post("/startup/products", data);
export const startupUpdateProduct = (id, data) => api.put(`/startup/products/${id}`, data);
export const startupDeleteProduct = (id) => api.delete(`/startup/products/${id}`);

// STARTUP INVENTORY SNAPSHOT (lightweight view)
// Uses /api/startup/inventory (startup.inventory.routes.js)
export const startupGetInventory = (params = {}) =>
  api.get("/startup/inventory", { params });

// STARTUP ORDERS (reuse generic /orders with server-side filtering by role)
export const startupGetOrders = () => api.get("/orders");
