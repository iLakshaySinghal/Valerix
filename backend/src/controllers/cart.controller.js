const CartService = require("../services/cart.service");

exports.addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required"
      });
    }

    const cart = await CartService.addToCart(userId, productId, Number(quantity));

    return res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await CartService.getCart(req.user.id);
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADDED: Update quantity controller to fix the error
exports.updateQuantity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const cart = await CartService.updateQuantity(
      userId,
      productId,
      Number(quantity)
    );

    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

// ADDED: Remove item controller
exports.removeItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await CartService.removeItem(userId, productId);
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

// ADDED: Clear cart controller
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await CartService.clearCart(req.user.id);
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};