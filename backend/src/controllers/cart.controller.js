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
