const vendorService = require("../services/vendorService");

const vendorController = {
  findAll: async (req, res, next) => {
    try {
      const {
        page = 1,
        limit = 10,
        orderBy = "vendor_name",
        sortBy = "asc",
        keyword,
      } = req.query;

      const data = await vendorService.findAll({
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
      const data = await vendorService.findById(id);
      return res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    let inputData = {
      ...req.body,
      vendor_image: req.files ? req.files.vendor_image?.[0]?.path : "",
      vendor_document: req.files ? req.files.vendor_document?.[0]?.path : "",
    };
    try {
      const data = await vendorService.create(inputData);
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
        vendor_image: req.filesh ? req.files.vendor_image?.[0]?.path : "",
        vendor_document: req.files ? req.files.vendor_document?.[0]?.path : "",
      };
      const data = await vendorService.updateById(id, inputData);
      return res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  deleteById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await vendorService.deleteById(id);
      return res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = vendorController;
