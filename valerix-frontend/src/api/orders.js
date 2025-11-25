import api from "../utils/api";

export const createOrder = (payload) => api.post("/orders", payload);
export const getOrders = () => api.get("/orders");
export const getOrder = (id) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}`, { status });
