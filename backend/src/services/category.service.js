const Category = require("../models/Category");
const slugify = require("slugify");

class CategoryService {
  // CREATE CATEGORY
  static async createCategory(data) {
    data.slug = slugify(data.name, { lower: true, strict: true });

    const exists = await Category.findOne({ slug: data.slug });
    if (exists) throw new Error("Category already exists");

    const category = await Category.create(data);
    return category;
  }

  // UPDATE CATEGORY
  static async updateCategory(id, updates) {
    if (updates.name) {
      updates.slug = slugify(updates.name, { lower: true, strict: true });
    }

    const category = await Category.findByIdAndUpdate(id, updates, { new: true });
    if (!category) throw new Error("Category not found");

    return category;
  }

  // DELETE CATEGORY
  static async deleteCategory(id) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new Error("Category not found");

    return category;
  }

  // GET CATEGORY
  static async getCategory(id) {
    const category = await Category.findById(id);
    if (!category) throw new Error("Category not found");

    return category;
  }

  // LIST ALL CATEGORIES
  static async listCategories() {
    return await Category.find({}).sort({ name: 1 });
  }
}

module.exports = CategoryService;
