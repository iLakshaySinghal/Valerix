const ChatMessage = require("../models/ChatMessage");

class ChatService {

  // Generate consistent room ID
  static makeRoomId(userA, userB) {
    return [userA.toString(), userB.toString()].sort().join("_");
  }

  // SEND MESSAGE
  static async sendMessage({ chatRoomId, senderId, message, attachments }) {
    const msg = await ChatMessage.create({
      chatRoomId,
      senderId,
      message,
      attachments: attachments || []
    });

    return msg;
  }

  // GET CHAT HISTORY
  static async getMessages(chatRoomId) {
    return ChatMessage
      .find({ chatRoomId })
      .sort({ createdAt: 1 })
      .lean();
  }
}

module.exports = ChatService;
