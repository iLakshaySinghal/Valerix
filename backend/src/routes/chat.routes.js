const router = require("express").Router();
const authJwt = require("../middlewares/authJwt");

const {
  getChatRoomId,
  getMessages,
  sendMessage
} = require("../controllers/chat.controller");

// All chat routes require login
router.use(authJwt);

// Get chat room ID for 2 startup owners
router.get("/room/:userId", getChatRoomId);

// Fetch messages of a room
router.get("/:roomId", getMessages);

// Send message
router.post("/:roomId", sendMessage);

module.exports = router;
