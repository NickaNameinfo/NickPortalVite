const db = require("../../../models");

module.exports = {
  // Create a new cart item
  async create(req, res, next) {
    try {
      const { productId, name, orderId, addressId, price, total, qty } = req.body;
      const newCart = await db.carts.create({
        productId,
        name,
        orderId,
        addressId,
        price,
        total,
        qty,
        photo : req?.file ? req?.file?.path : "",
      });
      res.status(201).json({ success: true, data: newCart });
    } catch (err) {
      next(err);
    }
  },

  // Get all cart items
  async index(req, res, next) {
    try {
      const carts = await db.carts.findAll({
        include: [
          { model: db.addresses},
          { model: db.orders}
        ]
      });
      res.status(200).json({ success: true, data: carts });
    } catch (err) {
      next(err);
    }
  },

  // Get cart item by ID
  async show(req, res, next) {
    try {
      const { id } = req.params;
      const cart = await db.carts.findOne({
        where: { id },
        include: [
          { model: db.addresses, attributes: ["id", "address"] },
          { model: db.orders, attributes: ["id", "orderNumber"] }
        ]
      });
      if (!cart) {
        return res.status(404).json({ success: false, message: "Cart item not found" });
      }
      res.status(200).json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  },

  // Update a cart item
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { productId, name, orderId, addressId, price, total, qty } = req.body;
      console.log(name , "name234234")

      const cart = await db.carts.findOne({ where: { id } });
      if (!cart) {
        return res.status(404).json({ success: false, message: "Cart item not found" });
      }
      await cart.update({
        productId: productId ?? cart.productId,
        name: name ?? cart.name,
        orderId: orderId ?? cart.orderId,
        addressId: addressId ?? cart.addressId,
        price: price ?? cart.price,
        total: total ?? cart.total,
        qty: qty ?? cart.qty,
        photo: req.file ? req.file.location : cart.photo
      });
      res.status(200).json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  },

  // Delete a cart item
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const cart = await db.carts.findOne({ where: { id } });
      if (!cart) {
        return res.status(404).json({ success: false, message: "Cart item not found" });
      }
      await cart.destroy();
      res.status(200).json({ success: true, message: "Cart item deleted" });
    } catch (err) {
      next(err);
    }
  }
};
