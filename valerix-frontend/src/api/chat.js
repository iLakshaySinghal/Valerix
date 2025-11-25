import api from "../utils/api";

export const getChats = () => api.get("/chat");              
export const getChatMessages = (chatId) => api.get(`/chat/${chatId}`);
export const sendMessage = (chatId, text) =>
  api.post(`/chat/${chatId}`, { text });

export const createChat = (receiverId) =>
  api.post("/chat/create", { receiverId });
