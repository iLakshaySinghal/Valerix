const CategoryService = require("../services/category.service");

// CREATE
exports.createCategory = async (req, res, next) => {
  try {
    const category = await CategoryService.createCategory(req.body);
    res.status(201).json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

// UPDATE
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await CategoryService.updateCategory(req.params.id, req.body);
    res.json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

// DELETE
exports.deleteCategory = async (req, res, next) => {
  try {
    await CategoryService.deleteCategory(req.params.id);
    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    next(err);
  }
};

// GET ONE
exports.getCategory = async (req, res, next) => {
  try {
    const category = await CategoryService.getCategory(req.params.id);
    res.json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

// LIST ALL
exports.listCategories = async (req, res, next) => {
  try {
    const categories = await CategoryService.listCategories();
    res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};
