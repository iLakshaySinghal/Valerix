import api from "../utils/api";

// Backend cart routes are:
// POST   /api/cart/add
// PUT    /api/cart/update
// DELETE /api/cart/remove/:productId
// DELETE /api/cart/clear
// GET    /api/cart/

export const addToCart = (payload) => api.post("/cart/add", payload);
export const updateCart = (payload) => api.put("/cart/update", payload);
export const removeFromCart = (productId) => api.delete(`/cart/remove/${productId}`);
export const clearCart = () => api.delete("/cart/clear");
export const getCart = () => api.get("/cart");
