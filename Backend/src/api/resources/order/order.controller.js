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
        product,
        grandTotal,
      } = req.body;
      db.customer
        .findOne({ where: { id: customerId } })
        .then((p) => {
          if (p) {
            return db.orders.create({
              custId: customerId,
              number: orderId,
              grandtotal: grandTotal,
              paymentmethod: paymentmethod,
            });
          }
          return res.status(500).json({ errors: ["User is not found"] });
        })
        .then((order) => {
          if (order) {
            return db.addresses.create({
              orderId: order.id,
              custId: customerId,
              fullname: deliveryAddress ? deliveryAddress.name : "",
              phone: deliveryAddress ? deliveryAddress.phone : "",
              discrict: deliveryAddress ? deliveryAddress.discrict : "",
              city: deliveryAddress ? deliveryAddress.city : "",
              states: deliveryAddress ? deliveryAddress.states : "",
              shipping: deliveryAddress ? deliveryAddress.address : "",
            }).then((p) => [order, p]);
          }
        })
        .then(([order, p]) => {
          if (order) {
            let cartEntries = [];
            for (var i = 0; i < product.length; i++) {
              cartEntries.push({
                orderId: order.id,
                addressId: p.id,
                productId: product[i].id,
                name: product[i].name,
                qty: product[i].qty,
                price: product[i].price,
                total: product[i].total,
                photo: product[i].photo,
              });
            }
            return db.carts.bulkCreate(cartEntries).then((r) => [r]);
          }
        })
        .then((success) => {
          res.status(200).json({ success: true });
        })
        .catch(function (err) {
          console.log(error);
          res.status(500).json({ errors: ["Error adding cart"] });
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async getAllOrderList(req, res, next) {
    let limit = 5000;
    let sort = ["createdAt", "DESC"];
    let offset = 0;
    let page = 1;
    if (req.query.limit != undefined) {
      limit = parseInt(req.query.limit);
    }
    if (req.query.page != undefined) {
      page = req.query.page;
      if (page < 1) page = 1;
    }
    if (req.query.sort) {
      if (req.query.sort == "name") {
        sort = ["name"];
      }
    }
    try {
      db.orders.findAll({
        order: [["createdAt", "DESC"]],
        include: [{ model: db.addresses }, { model: db.carts }],
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

  async statusUpdate(req, res, next) {
    try {
      const { id, status, deliverydate } = req.body;
      db.orders.findOne({ where: { id: id } })
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
      db.orders.findAll({
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
      db.orders.findAll({
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
      db.orders.findAll({
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
