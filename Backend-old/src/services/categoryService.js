const { Category } = require("../models");

const categoryService = {
  // Create a new category
  create: async (categoryData) => {
    try {
      const category = await Category.create(categoryData);
      return category;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get all categories
  findAll: async () => {
    try {
      const categories = await Category.findAll();
      return categories;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get a single category by ID
  findById: async (id) => {
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        throw new Error("Category not found");
      }
      return category;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Update a category by ID
  updateById: async (id, categoryData) => {
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        throw new Error("Category not found");
      }
      await category.update(categoryData);
      return category;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Delete a category by ID
  deleteById: async (id) => {
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        throw new Error("Category not found");
      }
      await category.destroy();
      return;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = categoryService;
