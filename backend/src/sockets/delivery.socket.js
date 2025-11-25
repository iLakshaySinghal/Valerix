module.exports = (io) => {

  const delivery = io.of("/delivery");

  delivery.on("connection", (socket) => {
    console.log("🚚 Delivery socket connected:", socket.id);

    // Delivery partner joins task room
    socket.on("joinTask", (taskId) => {
      socket.join(taskId);
      console.log(`📦 Delivery partner joined task room: ${taskId}`);
    });

    // When delivery partner updates location (from app)
    socket.on("updateLocation", ({ taskId, location }) => {
      delivery.to(taskId).emit("locationUpdate", {
        taskId,
        location
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ Delivery socket disconnected");
    });

  });

};
