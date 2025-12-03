const ProductService = require("../services/product.service.js");

/**
 * Create product (Requires startup/owner ID)
 */
exports.createProduct = async (req, res, next) => {
  try {
    // FIX 1: Inject the startup/owner ID into the body before calling the service
    // This allows the single-argument ProductService.createProduct(data) to work.
    req.body.startup = req.user.id; 
    
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
 * Update product (Must pass requester identity for ownership validation)
 */
exports.updateProduct = async (req, res, next) => {
  try {
    // FIX 2: Define requester identity for ownership check in service layer
    const requesterId = req.user.id;
    const isAdmin = req.user.role === "admin";
    
    // NOTE: This assumes ProductService.updateProduct has been modified to accept requesterId and options.
    const product = await ProductService.updateProduct(
      req.params.id, 
      req.body, // The updates
      { requesterId, isAdmin } // Passing identity details
    );
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete product (soft delete with ownership check)
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    // FIX 3: Define requester identity for ownership check in service layer
    const requesterId = req.user.id;
    const isAdmin = req.user.role === "admin";

    // NOTE: This assumes ProductService.deleteProduct has been modified to accept requesterId and options.
    const product = await ProductService.deleteProduct(
      req.params.id,
      { requesterId, isAdmin } // Passing identity details
    );
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