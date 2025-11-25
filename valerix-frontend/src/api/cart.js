import api from "../utils/api";

export const addToCart = (payload) => api.post("/cart", payload);
export const updateCart = (payload) => api.put("/cart", payload);
export const removeFromCart = (productId) => api.delete(`/cart/${productId}`);
export const getCart = () => api.get("/cart");
