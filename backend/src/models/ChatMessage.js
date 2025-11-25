const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema(
  {
    chatRoomId: {
      type: String,       // unique room ID (startup1-startup2)
      required: true
    },
    
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    message: {
      type: String,
      required: true
    },

    attachments: {
      type: [String], // S3 URLs if needed
      default: []
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);
