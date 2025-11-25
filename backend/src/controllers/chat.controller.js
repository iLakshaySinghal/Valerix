const ChatService = require("../services/chat.service");

exports.getChatRoomId = async (req, res, next) => {
  try {
    const userA = req.user.id;        // logged in user
    const userB = req.params.userId;  // target startup owner ID

    const roomId = ChatService.makeRoomId(userA, userB);

    res.json({
      success: true,
      roomId
    });
  } catch (err) {
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const msgs = await ChatService.getMessages(roomId);

    res.json({
      success: true,
      messages: msgs
    });
  } catch (err) {
    next(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { roomId } = req.params;
    const { message, attachments } = req.body;

    const msg = await ChatService.sendMessage({
      chatRoomId: roomId,
      senderId,
      message,
      attachments
    });

    res.json({
      success: true,
      message: msg
    });
  } catch (err) {
    next(err);
  }
};
