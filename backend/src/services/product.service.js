const Product = require("../models/Product");
const Category = require("../models/Category");
const slugify = require("slugify");
const mongoose = require("mongoose");
const InventoryService = require("./inventory.service"); // <--- ADDED IMPORT

class ProductService {

  // ==========================================================
  // CREATE PRODUCT
  // ==========================================================
  static async createProduct(data) {
    const { name, category, startup } = data;

    if (!name) throw new Error("Product name is required");
    if (!startup) throw new Error("Startup/owner is required");

    // -------- Validate category --------
    if (category === "") delete data.category;

    if (data.category) {
      const cat = await Category.findById(data.category);
      if (!cat) throw new Error("Category not found");
    }

    // -------- Generate unique slug --------
    const baseSlug = slugify(name, { lower: true, strict: true });
    let finalSlug = baseSlug;
    let counter = 1;

    while (await Product.findOne({ slug: finalSlug })) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    data.slug = finalSlug;

    // -------- Create product --------
    const product = await Product.create(data);
    
    // CRITICAL FIX: Initialize Inventory Item
    await InventoryService.ensureInventoryForProduct(product._id); 
    
    return product.toObject();
  }

  // ==========================================================
  // UPDATE PRODUCT
  // ==========================================================
  static async updateProduct(productId, updates) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID");
    }

    const product = await Product.findOne({
      _id: productId,
      isDeleted: false
    });

    if (!product) throw new Error("Product not found");

    // Validate category
    if (updates.category === "") delete updates.category;

    if (updates.category) {
      const cat = await Category.findById(updates.category);
      if (!cat) throw new Error("Category not found");
    }

    // Name changed → change slug
    if (updates.name && updates.name !== product.name) {
      const baseSlug = slugify(updates.name, { lower: true, strict: true });
      let newSlug = baseSlug;
      let counter = 1;

      while (
        await Product.findOne({
          slug: newSlug,
          _id: { $ne: productId }
        })
      ) {
        newSlug = `${baseSlug}-${counter++}`;
      }

      updates.slug = newSlug;
    }

    Object.assign(product, updates);
    await product.save();

    return product.toObject();
  }

  // ==========================================================
  // DELETE PRODUCT
  // ==========================================================
  static async deleteProduct(productId) {
    const updated = await Product.findOneAndUpdate(
      { _id: productId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!updated) throw new Error("Product not found");
    return updated.toObject();
  }

  // ==========================================================
  // PUBLIC LIST PRODUCTS
  // ==========================================================
  static async listProducts(query = {}) {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort = "createdAt:desc",
      page = 1,
      limit = 20
    } = query;

    const filter = { isDeleted: false };

    if (search) filter.name = { $regex: search, $options: "i" };
    if (category) filter.category = category;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // -------- Sorting --------
    let [sortField, sortDir] = sort.split(":");
    sortDir = sortDir === "asc" ? 1 : -1;

    // -------- Pagination --------
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .populate("category", "name")
      .sort({ [sortField]: sortDir })
      .skip(skip)
      .limit(Number(limit));

    const count = await Product.countDocuments(filter);

    return {
      success: true,
      count,
      page: Number(page),
      pages: Math.ceil(count / limit),
      products
    };
  }

  // ==========================================================
  // GET SINGLE PRODUCT
  // ==========================================================
  static async getProductById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid product ID");
    }

    const product = await Product.findOne({
      _id: id,
      isDeleted: false
    }).populate("category", "name");

    if (!product) throw new Error("Product not found");

    return product.toObject();
  }
}

module.exports = ProductService;