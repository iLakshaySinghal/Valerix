// src/api/user.js
import api from "../utils/api";

export const getProfile = () => api.get("/user/profile");
export const updateProfile = (data) => api.put("/user/profile", data);

export const getUserOrders = () => api.get("/orders");

export const getOrderById = (id) => api.get(`/orders/${id}`);

export const getProducts = (params) =>
  api.get("/products", { params });

export const getProduct = (id) =>
  api.get(`/products/${id}`);
