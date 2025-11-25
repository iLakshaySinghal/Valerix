const ProductService = require("../services/product.service.js");

/**
 * Create product (no startup logic)
 */
exports.createProduct = async (req, res, next) => {
  try {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

/**
 * Get a single product
 */
exports.getProduct = async (req, res, next) => {
  try {
    const product = await ProductService.getProductById(req.params.id);

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

/**
 * Update product (no startup validation)
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await ProductService.updateProduct(req.params.id, req.body);
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete product (soft delete)
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await ProductService.deleteProduct(req.params.id);
    res.json({ success: true, message: "Product deleted", product });
  } catch (err) {
    next(err);
  }
};

/**
 * Public list of products
 */
exports.listProducts = async (req, res, next) => {
  try {
    const data = await ProductService.listProducts(req.query);
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};
