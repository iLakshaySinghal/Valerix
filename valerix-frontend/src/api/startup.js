import api from "../utils/api";

// PROFILE
export const getStartupProfile = () => api.get("/startup/profile");
export const updateStartupProfile = (data) => api.post("/startup/profile", data);

// PRODUCTS
export const startupGetProducts = () => api.get("/products?own=true");
export const startupCreateProduct = (data) => api.post("/products", data);
export const startupUpdateProduct = (id, data) => api.put(`/products/${id}`, data);
export const startupDeleteProduct = (id) => api.delete(`/products/${id}`);

// INVENTORY
export const startupGetInventory = () => api.get("/admin/inventory?startupOnly=true");
export const startupUpdateStock = (payload) => api.post("/admin/inventory/update", payload);

// ORDERS
export const startupGetOrders = () => api.get("/orders?startup=true");
