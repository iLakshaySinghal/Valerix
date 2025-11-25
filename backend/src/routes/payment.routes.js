const router = require("express").Router();
const authJwt = require("../middlewares/authJwt");
const requireRole = require("../middlewares/requireRole");
const PaymentController = require("../controllers/payment.controller");

// all payment routes require login
router.use(authJwt);

// User pays for order
router.post("/:orderId/pay", requireRole(["user"]), PaymentController.payOrder);

// Admin can view all invoices (optional)
router.get("/invoices", requireRole(["admin"]), PaymentController.getAllInvoices);

module.exports = router;
