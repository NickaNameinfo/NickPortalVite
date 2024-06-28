const categoryService = require("../services/categoryService");

const categoryController = {
  // Get all categories
  findAll: async (req, res, next) => {
    try {
      const categories = await categoryService.findAll();
      return res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  },

  // Get a single category by ID
  findById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await categoryService.findById(id);
      return res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  // Create a new category
  create: async (req, res, next) => {
    try {
      const category = await categoryService.create(req.body);
      return res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  // Update a category by ID
  updateById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await categoryService.updateById(id, req.body);
      return res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },

  // Delete a category by ID
  deleteById: async (req, res, next) => {
    try {
      const { id } = req.params;
      await categoryService.deleteById(id);
      return res.status(204).json({ success: true });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryController;
