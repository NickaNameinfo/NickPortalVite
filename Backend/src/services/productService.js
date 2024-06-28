const db = require("../models"); // Adjust path as necessary
const Product = db.Product;
const Category = db.Category;
const Vendor = db.Vendor;

const productService = {
  findAll: async ({
    page = 1,
    limit = 10,
    orderBy = "product_name",
    sortBy = "asc",
    keyword,
  }) => {
    try {
      const offset = (page - 1) * limit;
      let whereCondition = {};

      // Apply keyword search if provided
      if (keyword) {
        whereCondition = {
          [Op.or]: [
            { product_name: { [Op.like]: `%${keyword}%` } },
            { description: { [Op.like]: `%${keyword}%` } },
            // Add more fields for keyword search as needed
          ],
        };
      }

      const products = await Product.findAll({
        where: whereCondition,
        include: [Category, Vendor], // Include associations
        order: [[orderBy, sortBy]],
        limit: +limit,
        offset: +offset,
      });

      return products;
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  },

  findById: async (productId) => {
    try {
      const product = await Product.findByPk(productId, {
        include: [Category, Vendor], // Include associations
      });

      if (!product) {
        throw new Error("Product not found");
      }

      return product;
    } catch (error) {
      throw new Error(`Error fetching product: ${error.message}`);
    }
  },

  create: async (productData) => {
    try {
      const {
        product_name,
        category_id,
        price,
        stock,
        quantity,
        offers,
        delivery_type,
        image,
        status,
        vendor_id,
        description,
        short_description,
      } = productData;

      // Check if Category and Vendor exist
      const category = await Category.findByPk(category_id);
      if (!category) {
        throw new Error("Category not found");
      }

      const vendor = await Vendor.findByPk(vendor_id);
      if (!vendor) {
        throw new Error("Vendor not found");
      }

      // Create product
      const newProduct = await Product.create({
        product_name,
        category_id,
        price,
        stock,
        quantity,
        offers,
        delivery_type,
        image,
        status,
        vendor_id,
        description,
        short_description,
      });

      return newProduct;
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  },

  updateById: async (productId, productData) => {
    try {
      const product = await Product.findByPk(productId);

      if (!product) {
        throw new Error("Product not found");
      }

      const {
        product_name,
        category_id,
        price,
        stock,
        quantity,
        offers,
        delivery_type,
        image,
        status,
        vendor_id,
        description,
        short_description,
      } = productData;

      // Check if Category and Vendor exist
      const category = await Category.findByPk(category_id);
      if (!category) {
        throw new Error("Category not found");
      }

      const vendor = await Vendor.findByPk(vendor_id);
      if (!vendor) {
        throw new Error("Vendor not found");
      }

      // Update product
      await product.update({
        product_name,
        category_id,
        price,
        stock,
        quantity,
        offers,
        delivery_type,
        image,
        status,
        vendor_id,
        description,
        short_description,
      });

      return product;
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  },

  deleteById: async (productId) => {
    try {
      const product = await Product.findByPk(productId);

      if (!product) {
        throw new Error("Product not found");
      }

      await product.destroy();
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  },
};

module.exports = productService;
