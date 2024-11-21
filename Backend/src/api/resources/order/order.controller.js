const Sequelize = require("sequelize");
const db = require("../../../models");

module.exports = {
  async index(req, res, next) {
    try {
      const {
        customerId,
        paymentmethod,
        orderId,
        deliveryAddress,
        productIds,
        grandTotal,
        qty,
      } = req.body;
      console.log(customerId, grandTotal, "grandTotal79087890");
      db.user
        .findOne({ where: { id: customerId } })
        .then((p) => {
          if (p) {
            return db.orders.create({
              custId: customerId,
              number: orderId,
              grandtotal: grandTotal,
              paymentmethod: paymentmethod,
              productIds: productIds,
              qty: qty,
            });
          }
          return res.status(500).json({ errors: ["User is not found"] });
        })
        .then((success) => {
          res.status(200).json({ success: true, data: success });
        })
        .catch(function (err) {
          console.log(err);
          res.status(500).json({ errors: ["Error adding cart"] });
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async getAllOrderList(req, res, next) {
    try {
      db.orders
        .findAll({
          order: [["createdAt", "DESC"]],
          include: [{ model: db.addresses }],
        })
        .then((list) => {
          res.status(200).json({ success: true, data: list });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      res.status(500).json({ errors: "" + err });
    }
  },

  async statusUpdate(req, res, next) {
    try {
      const { id, status, deliverydate } = req.body;
      db.orders
        .findOne({ where: { id: id } })
        .then((list) => {
          return db.orders.update(
            {
              status: status,
              deliverydate: deliverydate ? deliverydate : list.deliverydate,
            },
            { where: { id: id } }
          );
        })
        .then((success) => {
          res
            .status(200)
            .json({ success: true, msg: "Successfully Updated Status" });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      res.status(500).json({ errors: "" + err });
    }
  },

  async getAllOrderListById(req, res, next) {
    try {
      db.orders
        .findAll({
          where: { custId: req.body.id },
          order: [["createdAt", "DESC"]],
          include: [{ model: db.addresses, include: [{ model: db.carts }] }],
        })
        .then((list) => {
          res.status(200).json({ success: true, order: list });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      res.status(500).json({ errors: "" + err });
    }
  },
  async getAllOrderStatus(req, res, next) {
    try {
      db.orders
        .findAll({
          where: { status: req.body.status },
          order: [["createdAt", "DESC"]],
          include: [{ model: db.addresses, include: [{ model: db.carts }] }],
        })
        .then((list) => {
          res.status(200).json({ success: true, order: list });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      res.status(500).json({ errors: "" + err });
    }
  },
  async getAllOrderCount(req, res, next) {
    try {
      db.orders
        .findAll({
          attributes: [
            "status",
            [Sequelize.fn("COUNT", Sequelize.col("status")), "total"],
          ],
          group: ["status"],
        })
        .then((list) => {
          res.status(200).json({ success: true, data: list });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      res.status(500).json({ errors: "" + err });
    }
  },
};
