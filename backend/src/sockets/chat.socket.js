const ChatService = require("../services/chat.service");

module.exports = (io) => {

  // Namespace: /chat
  const chat = io.of("/chat");

  chat.on("connection", (socket) => {
    console.log("🔵 Chat socket connected:", socket.id);

    //------------------------------------------------------
    // JOIN CHAT ROOM
    //------------------------------------------------------
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`📌 User joined room: ${roomId}`);
    });

    //------------------------------------------------------
    // NEW MESSAGE
    //------------------------------------------------------
    socket.on("sendMessage", async (data) => {
      const { roomId, senderId, message, attachments } = data;

      // Save in DB
      const msg = await ChatService.sendMessage({
        chatRoomId: roomId,
        senderId,
        message,
        attachments
      });

      // Broadcast to room
      chat.to(roomId).emit("newMessage", msg);
    });

    //------------------------------------------------------
    // TYPING INDICATOR
    //------------------------------------------------------
    socket.on("typing", ({ roomId, userId }) => {
      socket.to(roomId).emit("typing", { userId });
    });

    //------------------------------------------------------
    // DISCONNECT
    //------------------------------------------------------
    socket.on("disconnect", () => {
      console.log("🔴 Chat socket disconnected:", socket.id);
    });

  });

};
