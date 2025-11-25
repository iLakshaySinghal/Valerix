const DeliveryTask = require("../models/DeliveryTask");
const Order = require("../models/Order");

class DeliveryService {

  // Create new delivery task when admin assigns a partner
  static async createTask(order) {
    return DeliveryTask.create({
      orderId: order._id,
      deliveryPartnerId: order.deliveryPartnerId,
      customerAddress: order.address,
      customerPhone: order.userId.phone // make sure User model has phone
    });
  }

  // Fetch all tasks for a delivery partner
  static async getMyTasks(deliveryPartnerId) {
    return DeliveryTask.find({ deliveryPartnerId })
      .populate("orderId")
      .sort({ createdAt: -1 })
      .lean();
  }

  // Update status (picked, on_the_way, delivered)
  static async updateStatus(taskId, status) {
    const task = await DeliveryTask.findById(taskId);
    if (!task) throw new Error("Task not found");
    task.status = status;
    await task.save();
    return task;
  }

  // Update GPS location
  static async updateLocation(taskId, lat, lng) {
    const task = await DeliveryTask.findById(taskId);
    if (!task) throw new Error("Task not found");

    task.currentLocation = { lat, lng };
    await task.save();

    return task;
  }
}

module.exports = DeliveryService;
