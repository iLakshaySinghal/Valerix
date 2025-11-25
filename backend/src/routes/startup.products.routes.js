const router = require("express").Router();
const authJwt = require("../middlewares/authJwt");
const requireRole = require("../middlewares/requireRole");
const Product = require("../models/Product");

// protect all routes
router.use(authJwt, requireRole(["startup"]));

/**
 * Create product
 */
router.post("/", async (req, res, next) => {
  try {
    const { name, price, stock, description, category } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    const product = await Product.create({
      name,
      price,
      stock: stock || 0,
      description,
      category: category || null,
      owner: req.user.id, // store startup id
    });

    res.json({
      success: true,
      product,
      message: "Product created successfully",
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get all startup products
 */
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find({ owner: req.user.id });

    res.json({
      success: true,
      products,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
