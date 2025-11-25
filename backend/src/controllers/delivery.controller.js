const DeliveryService = require("../services/delivery.service");

exports.getMyTasks = async (req, res, next) => {
  try {
    const deliveryPartnerId = req.user.id;
    const tasks = await DeliveryService.getMyTasks(deliveryPartnerId);
    res.json({ success: true, tasks });
  } catch (err) {
    next(err);
  }
};

exports.updateTaskStatus = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const { status } = req.body;
    const task = await DeliveryService.updateStatus(taskId, status);
    res.json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

exports.updateLocation = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const { lat, lng } = req.body;
    const task = await DeliveryService.updateLocation(taskId, lat, lng);

    // Broadcast new location to frontend (Admin/User tracking)
    req.io.of("/delivery").to(taskId).emit("locationUpdate", {
      taskId,
      location: { lat, lng }
    });

    res.json({ success: true, task });
  } catch (err) {
    next(err);
  }
};
