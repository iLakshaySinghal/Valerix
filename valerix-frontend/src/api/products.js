import api from "../utils/api";

// Public catalogue
export const fetchProducts = (params) => api.get("/products", { params });
export const fetchProduct = (id) => api.get(`/products/${id}`);

// Authenticated CRUD (admin + startup) – uses /api/products routes
export const createProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
