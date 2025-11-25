// src/api/admin.js
import api from "../utils/api";

// DASHBOARD / METRICS
export const adminGetDashboard = () => api.get("/admin/dashboard");

// INVENTORY
export const adminGetInventory = (params = {}) =>
  api.get("/admin/inventory", { params });

export const adminUpdateInventory = (payload) =>
  api.post("/admin/inventory/update", payload);

// PRODUCTS (admin view)
export const adminGetProducts = (params = {}) =>
  api.get("/products", { params }); // adjust to /admin/products if you add that

export const adminCreateProduct = (payload) =>
  api.post("/products", payload);

export const adminUpdateProduct = (id, payload) =>
  api.put(`/products/${id}`, payload);

export const adminDeleteProduct = (id) =>
  api.delete(`/products/${id}`);

// ORDERS
export const adminGetOrders = (params = {}) =>
  api.get("/orders/admin", { params }); // make sure backend supports this

export const adminUpdateOrderStatus = (id, status) =>
  api.put(`/orders/${id}/status`, { status });

export const adminAssignDeliveryPartner = (id, partnerId) =>
  api.post(`/orders/${id}/assign`, { partnerId });

// USERS
export const adminGetUsers = (params = {}) =>
  api.get("/users/admin", { params }); // implement in backend

// DELIVERY TASKS
export const adminGetDeliveryTasks = (params = {}) =>
  api.get("/delivery/admin/tasks", { params }); // implement in backend
