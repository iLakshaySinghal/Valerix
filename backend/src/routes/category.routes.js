const router = require("express").Router();
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  listCategories,
} = require("../controllers/category.controller");

const authJwt = require("../middlewares/authJwt");
const requireRole = require("../middlewares/requireRole");

// Public — list categories & get one
router.get("/", listCategories);
router.get("/:id", getCategory);

// Admin only
router.post("/", authJwt, requireRole(["admin"]), createCategory);
router.put("/:id", authJwt, requireRole(["admin"]), updateCategory);
router.delete("/:id", authJwt, requireRole(["admin"]), deleteCategory);

module.exports = router;
