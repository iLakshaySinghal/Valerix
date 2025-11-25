const router = require("express").Router();
const authJwt = require("../middlewares/authJwt");
const requireRole = require("../middlewares/requireRole");
const controller = require("../controllers/startup.controller");

// All require authentication
router.use(authJwt, requireRole("startup"));

// Stats
router.get("/stats", controller.getStats);

// Products
router.post("/products", controller.createProduct);
router.get("/products", controller.getMyProducts);
router.put("/products/:id", controller.updateProduct);
router.delete("/products/:id", controller.deleteProduct);

// Inventory
router.get("/inventory", controller.inventoryStats);

module.exports = router;
