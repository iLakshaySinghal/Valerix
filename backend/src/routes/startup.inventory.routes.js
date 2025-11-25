const router = require("express").Router();
const authJwt = require("../middlewares/authJwt");
const requireRole = require("../middlewares/requireRole");
const Product = require("../models/Product");

router.use(authJwt);
router.use(requireRole(["startup"]));

// GET /api/startup/inventory
router.get("/", async (req, res, next) => {
  try {
    const { id } = req.user;
    const { limit = 50, sort = "stock:asc" } = req.query;

    const [sortField, sortDir] = sort.split(":");

    const products = await Product.find({ ownerId: id })
      .sort({ [sortField]: sortDir === "asc" ? 1 : -1 })
      .limit(Number(limit));

    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
