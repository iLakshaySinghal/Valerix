// src/routes/order.routes.js

const router = require("express").Router();
const authJwt = require("../middlewares/authJwt");
const requireRole = require("../middlewares/requireRole");

const orderController = require("../controllers/order.controller");
const paymentController = require("../controllers/payment.controller");

// ----------------------------------
// ALL ORDER ROUTES REQUIRE LOGIN
// ----------------------------------
router.use(authJwt);

// ----------------------------------
// CREATE ORDER (CHECKOUT)
// POST /api/orders
// ----------------------------------
router.post(
  "/",
  requireRole(["user", "startup"]),
  orderController.createOrder
);

// ----------------------------------
// GET MY ORDERS
// GET /api/orders
// ----------------------------------
router.get(
  "/",
  requireRole(["user", "startup"]),
  orderController.getUserOrders
);

// ----------------------------------
// GET SINGLE ORDER
// GET /api/orders/:id
// ----------------------------------
router.get(
  "/:id",
  requireRole(["user", "startup", "admin"]),
  orderController.getOrder
);

// ----------------------------------
// PAY FOR ORDER
// POST /api/orders/:id/pay
// ----------------------------------
router.post(
  "/:id/pay",
  requireRole(["user", "startup"]),
  orderController.payForOrder   // FIXED: use controller, not paymentController
);

// ----------------------------------
// ADMIN: UPDATE ORDER STATUS
// PUT /api/orders/:id/status
// ----------------------------------
router.put(
  "/:id/status",
  requireRole(["admin"]),
  orderController.updateStatus
);

// ----------------------------------
// ADMIN: ASSIGN DELIVERY PARTNER
// POST /api/orders/:id/assign
// ----------------------------------
router.post(
  "/:id/assign",
  requireRole(["admin"]),
  orderController.assignDelivery
);

// ----------------------------------
// ADMIN: GET ALL ORDERS
// GET /api/orders/admin/all
// ----------------------------------
router.get(
  "/admin/all",
  requireRole(["admin"]),
  orderController.getAllOrders
);

module.exports = router;
