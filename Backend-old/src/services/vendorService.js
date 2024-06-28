const { Vendor } = require("../models");
const { Op } = require("sequelize");

const vendorService = {
  // Fetch all vendors with pagination, sorting, and filtering
  findAll: async ({ page, limit, orderBy, sortBy, keyword }) => {
    const options = {
      offset: (page - 1) * limit,
      limit: limit,
      order: [[orderBy, sortBy]],
      where: {},
    };

    if (keyword) {
      options.where.vendor_name = { [Op.like]: `%${keyword}%` };
    }

    const { rows, count } = await Vendor.findAndCountAll(options);
    return {
      data: rows,
      total: count,
      page,
      pages: Math.ceil(count / limit),
    };
  },

  // Fetch a single vendor by ID
  findById: async (id) => {
    return await Vendor.findByPk(id);
  },

  // Create a new vendor
  create: async (data) => {
    return await Vendor.create(data);
  },

  // Update an existing vendor by ID
  updateById: async (id, data) => {
    const [updated] = await Vendor.update(data, { where: { id: id } });
    if (updated) {
      return await Vendor.findByPk(id);
    }
    throw new Error("Vendor not found");
  },

  // Delete a vendor by ID
  deleteById: async (id) => {
    const deleted = await Vendor.destroy({ where: { id: id } });
    if (deleted) {
      return true;
    }
    throw new Error("Vendor not found");
  },
};

module.exports = vendorService;
