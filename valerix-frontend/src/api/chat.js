import api from "../utils/api";

// Backend chat HTTP routes:
// GET  /api/chat/room/:userId  -> getChatRoomId
// GET  /api/chat/:roomId       -> getMessages
// POST /api/chat/:roomId       -> sendMessage
// (Optional) GET /api/chat     -> list chats (not yet implemented server-side,
//           frontend will handle empty/error states gracefully)

export const getChats = () => api.get("/chat");
export const getChatRoomId = (userId) => api.get(`/chat/room/${userId}`);
export const getChatMessages = (roomId) => api.get(`/chat/${roomId}`);
export const sendMessage = (roomId, message, attachments) =>
  api.post(`/chat/${roomId}`, { message, attachments });
