import client from "./client";

export const fetchProducts = (params) => client.get("/products", { params });
export const fetchProduct = (id) => client.get(`/products/${id}`);
export const createProduct = (data) => client.post("/startup/products", data);
export const updateProduct = (id, data) => client.put(`/startup/products/${id}`, data);
export const deleteProduct = (id) => client.delete(`/startup/products/${id}`);
