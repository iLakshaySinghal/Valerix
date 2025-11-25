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
// PROTECTED ROUTES (Admin Only)
// -------------------------------
// You can change "admin" to ["admin", "manager"] etc.
router.post("/", authJwt, requireRole("admin"), createProduct);
router.put("/:id", authJwt, requireRole("admin"), updateProduct);
router.delete("/:id", authJwt, requireRole("admin"), deleteProduct);

module.exports = router;
