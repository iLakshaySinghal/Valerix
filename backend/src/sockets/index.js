const { Server } = require("socket.io");
const chatSocket = require("./chat.socket");
const deliverySocket = require("./delivery.socket");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true
    }
  });

  chatSocket(io);
  deliverySocket(io);

  return io;
};
