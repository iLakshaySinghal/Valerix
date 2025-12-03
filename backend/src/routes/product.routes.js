const router = require("express").Router();
const {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  listProducts
} = require("../controllers/product.controller");

// Middlewares
const authJwt = require("../middlewares/authJwt");
const requireRole = require("../middlewares/requireRole");

// -------------------------------
// PUBLIC ROUTES
// -------------------------------
router.get("/", listProducts);       // Get all products
router.get("/:id", getProduct);      // Get single product


// -------------------------------
// PROTECTED ROUTES (Admin & Startup)
// -------------------------------
// FIX: Allow both 'admin' and 'startup' roles. The controller/service will enforce ownership.
router.post("/", authJwt, requireRole(["admin", "startup"]), createProduct);
router.put("/:id", authJwt, requireRole(["admin", "startup"]), updateProduct);
router.delete("/:id", authJwt, requireRole(["admin", "startup"]), deleteProduct);

module.exports = router;