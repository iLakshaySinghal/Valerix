const router = require("express").Router();
const authJwt = require("../middlewares/authJwt");
const requireRole = require("../middlewares/requireRole");
const deliveryController = require("../controllers/delivery.controller");

// All routes require login
router.use(authJwt);

// Delivery partner: see my assigned tasks
router.get("/tasks", requireRole(["delivery"]), deliveryController.getMyTasks);

// Delivery partner: update status
router.patch("/:id/status", requireRole(["delivery"]), deliveryController.updateTaskStatus);

// Delivery partner: update live location
router.patch("/:id/location", requireRole(["delivery"]), deliveryController.updateLocation);

module.exports = router;
