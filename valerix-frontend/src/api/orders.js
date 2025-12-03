import api from "../utils/api";

// User/startup orders
export const createOrder = (payload) => api.post("/orders", payload);
export const getOrders = () => api.get("/orders");
export const getOrder = (id) => api.get(`/orders/${id}`);

// Admin: update order status (matches PUT /api/orders/:id/status)
export const updateOrderStatus = (id, status) =>
  api.put(`/orders/${id}/status`, { status });
