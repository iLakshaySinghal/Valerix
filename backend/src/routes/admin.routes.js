const router = require("express").Router();
const authJwt = require("../middlewares/authJwt");
const requireRole = require("../middlewares/requireRole");
const adminController = require("../controllers/admin.controller");

// all admin routes should be protected
router.use(authJwt);
router.use(requireRole(["admin"]));

// Inventory listing / filters
router.get("/inventory", adminController.getInventory);

// Update stock (delta: +10 or -5)
router.post("/inventory/update", adminController.updateStock);

// Set stock absolute
router.post("/inventory/set", adminController.setStock);

// Inventory logs for a product
router.get("/inventory/:productId/logs", adminController.getLogs);

// Dashboard KPIs
router.get("/dashboard", adminController.getDashboard);

module.exports = router;
