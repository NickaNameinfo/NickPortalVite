const express = require("express");
const router = express.Router();
const productService = require("../services/productService");

const productController = {
  findAll: async (req, res, next) => {
    try {
      const {
        page = 1,
        limit = 10,
        orderBy = "product_name",
        sortBy = "asc",
        keyword,
      } = req.query;

      const data = await productService.findAll({
        page: +page ? +page : 1,
        limit: +limit ? +limit : 10,
        orderBy,
        sortBy,
        keyword,
      });

      return res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  findById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await productService.findById(id);
      return res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    let inputData = {
      ...req.body,
      // Handle file uploads if applicable
    };

    try {
      const data = await productService.create(inputData);
      return res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  updateById: async (req, res, next) => {
    try {
      const { id } = req.params;
      let inputData = {
        ...req.body,
        // Handle file uploads if applicable
      };
      const data = await productService.updateById(id, inputData);
      return res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  deleteById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await productService.deleteById(id);
      return res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;
