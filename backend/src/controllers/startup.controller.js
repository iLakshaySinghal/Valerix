
const ProductService = require("../services/product.service");



// =============================
// PRODUCT MANAGEMENT
// =============================
exports.createProduct = async (req, res, next) => {
  try {
    const ownerId = req.user.id;

    const product = await ProductService.createProduct(ownerId, req.body);

    res.json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyProducts = async (req, res, next) => {
  try {
    const ownerId = req.user.id;

    const products = await ProductService.getProductsByOwner(ownerId);

    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const { id } = req.params;

    const updated = await ProductService.updateProduct(ownerId, id, req.body);

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updated,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const { id } = req.params;

    const removed = await ProductService.deleteProduct(ownerId, id);

    res.json({
      success: true,
      message: "Product deleted successfully",
      removed,
    });
  } catch (err) {
    next(err);
  }
};

// =============================
// INVENTORY / STATS
// =============================
exports.inventoryStats = async (req, res, next) => {
  try {
    const ownerId = req.user.id;

    const stats = await ProductService.inventoryStats(ownerId);

    res.json({
      success: true,
      ...stats,
    });
  } catch (err) {
    next(err);
  }
};

// Extra route your frontend calls
exports.getStats = async (req, res) => {
  return res.json({
    success: true,
    products: 0,
    revenue: 0,
    orders: 0,
  });
};
