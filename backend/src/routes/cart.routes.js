// src/routes/cart.routes.js
const router = require("express").Router();
const authJwt = require("../middlewares/authJwt");
const cartController = require("../controllers/cart.controller");

router.use(authJwt);

// Get cart
router.get("/", cartController.getCart);

// Add item
router.post("/add", cartController.addToCart);

// Update quantity
router.put("/update", cartController.updateQuantity);

// Delete item
router.delete("/remove/:productId", cartController.removeItem);

// Clear cart
router.delete("/clear", cartController.clearCart);

module.exports = router;
