const Cart = require("../models/Cart");
const Product = require("../models/Product");

class CartService {

  // ------------------------------------------
  // GET OR CREATE CART
  // ------------------------------------------
  static async getOrCreateCart(userId) {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }
    return cart;
  }

  // ------------------------------------------
  // GET CART (POPULATED)
  // ------------------------------------------
  static async getCart(userId) {
    const cart = await Cart.findOne({ userId })
      .populate("items.productId", "name price");

    return cart || { items: [] };
  }

  // ------------------------------------------
  // ADD TO CART
  // ------------------------------------------
  static async addToCart(userId, productId, quantity) {

    // Validate product existence
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    const cart = await CartService.getOrCreateCart(userId);

    const itemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === productId
    );

    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    return await Cart.findOne({ userId })
      .populate("items.productId", "name price");
  }

  // ------------------------------------------
  // UPDATE QUANTITY
  // ------------------------------------------
  static async updateQuantity(userId, productId, quantity) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("Cart not found");

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (!item) throw new Error("Item not found");

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => i.productId.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();

    return await Cart.findOne({ userId })
      .populate("items.productId", "name price");
  }

  // ------------------------------------------
  // REMOVE ITEM
  // ------------------------------------------
  static async removeItem(userId, productId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) return cart;

    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId
    );

    await cart.save();

    return await Cart.findOne({ userId })
      .populate("items.productId", "name price");
  }

  // ------------------------------------------
  // CLEAR CART
  // ------------------------------------------
  static async clearCart(userId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) return null;

    cart.items = [];
    await cart.save();

    return cart;
  }
}

module.exports = CartService;
