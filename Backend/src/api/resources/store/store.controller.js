const db = require("../../../models");

module.exports = {
  /* Add user api start here................................*/

  async index(req, res, next) {
    try {
      const {
        id,
        storename,
        status,
        storeaddress,
        storedesc,
        ownername,
        owneraddress,
        email,
        password,
        phone,
        areaId,
        accountNo,
        accountHolderName,
        IFSC,
        bankName,
        branch,
        adharCardNo,
        panCardNo,
        GSTNo,
      } = req.body;
      console.log(id, "id452342");
      console.log(areaId, "areaId3452345");

      db.store
        .findOne({ where: { id: id ? id : null } })
        .then((supplier) => {
          if (supplier) {
            console.log(supplier, "supplier4234523");

            return db.store.update(
              {
                storename: storename ? storename : supplier.storename,
                status: status ? status : supplier.status,
                storeaddress: storeaddress ? storeaddress : supplier.storeaddress,
                storedesc: storedesc ? storedesc : supplier.storedesc,
                ownername: ownername ? ownername : supplier.ownername,
                owneraddress: owneraddress
                  ? owneraddress
                  : supplier.owneraddress,
                email: email ? email : supplier.email,
                phone: phone ? phone : supplier.phone,
                accountNo: accountNo ? accountNo : supplier.accountNo,
                accountHolderName: accountHolderName
                  ? accountHolderName
                  : supplier.accountHolderName,
                IFSC: IFSC ? IFSC : supplier.IFSC,
                bankName: bankName ? bankName : supplier.bankName,
                branch: branch ? branch : supplier.branch,
                adharCardNo: adharCardNo ? adharCardNo : supplier.adharCardNo,
                panCardNo: panCardNo ? panCardNo : supplier.panCardNo,
                GSTNo: GSTNo ? GSTNo : supplier.GSTNo,
              },
              { where: { id: id } }
            );
          }
          return db.store.create({
            storename: storename,
            status: status,
            storeaddress: storeaddress,
            storedesc: storedesc,
            ownername: ownername,
            owneraddress: owneraddress,
            email: email,
            password: password,
            phone: phone,
            accountNo: accountNo,
            accountHolderName: accountHolderName,
            IFSC: IFSC,
            bankName: bankName,
            branch: branch,
            adharCardNo: adharCardNo,
            panCardNo: panCardNo,
            GSTNo: GSTNo,
            areaId: areaId,
          });
        })
        .then((store) => {
          if (areaId) {
            let areaList = [];
            for (var i = 0; i < areaId.length; i++) {
              areaList.push({
                storeId: store.id,
                areaId: areaId[i],
              });
            }
            return db.store_area.bulkCreate(areaList);
          }
          return true;
        })
        .then((success) => {
          res
            .status(200)
            .json({ success: true, msg: "Successfully inserted supplier" });
        })
        .catch(function (err) {
          console.log(err);
          next(err);
        });
    } catch (err) {
      console.log(err);
      throw new RequestError("Error");
    }
  },

  async storeAddProduct(req, res, next) {
    try {
      const { supplierId, productId, unitSize, buyerPrice } = req.body;
      let id = productId;
      db.store_product
        .findAll({
          where: {
            supplierId: supplierId,
            productId: productId,
            unitSize: unitSize,
          },
        })
        .then((data) => {
          if (!data.length > 0) {
            return db.store_product.create({
              supplierId: supplierId,
              productId: productId,
              unitSize: unitSize,
              price: buyerPrice,
            });
          } else {
            return db.store_product.update(
              {
                unitSize: unitSize ? unitSize : data.unitSize,
                price: buyerPrice ? buyerPrice : data.buyerPrice,
              },
              { where: { supplierId: supplierId, productId: productId } }
            );
          }
        })
        .then((success) => {
          res.status(200).json({
            success: true,
            msg: "Successfully inserted product in storeList",
          });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async getAllstore(req, res, next) {
    try {
      db.store
        .findAll({
          include: [
            {
              model: db.area,
              attributes: ["id", "name"],
              include: [{ model: db.location, attributes: ["id", "name"] }],
            },
          ],
        })
        .then((list) => {
          res.status(200).json({ success: true, data: list });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  //Get by Id
  async getstoreStockById(req, res, next) {
    try {
      const { id } = req.params;
      db.store
        .findAll({
          where: { id: id },
          include: [
            {
              model: db.area,
              attributes: ["id", "name"],
              include: [{ model: db.location, attributes: ["id", "name"] }],
            },
          ],
        })
        .then((list) => {
          res.status(200).json({ success: true, data: list });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async getAllstoreProduct(req, res, next) {
    try {
      db.product
        .findAll({
          attributes: ["id", "name", "brand"],
          include: [
            {
              model: db.store_product,
              attributes: [
                "id",
                "supplierId",
                "productId",
                "unitSize",
                "price",
              ],
              include: [
                {
                  model: db.store,
                  attributes: ["id", "storename", "ownername"],
                },
              ],
            },
          ],
        })
        .then((list) => {
          res.status(200).json({ success: true, data: list });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async getProductBystore(req, res, next) {
    try {
      db.store_product
        .findAll({
          attributes: ["id", "supplierId", "productId", "unitSize", "price"],
          where: { supplierId: req.body.id },
          include: [
            {
              model: db.product,
              attributes: ["id", "name", "brand", "photo", "status"],
            },
          ],
        })
        .then((list) => {
          res.status(200).json({ success: true, data: list });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async storeUpdate(req, res, next) {
    try {
      const {
        id,
        storename,
        status,
        storeaddress,
        storedesc,
        ownername,
        owneraddress,
        email,
        password,
        phone,
      } = req.body;
      db.store
        .findOne({ where: { id: id } })
        .then((list) => {
          if (list) {
            return db.store.update(
              {
                storename: storename,
                status: parseInt(status) ? "active" : "inactive",
                storeaddress: storeaddress ? storeaddress : list.storeaddress,
                storedesc: storedesc ? storedesc : list.storedesc,
                ownername: ownername ? ownername : list.ownername,
                owneraddress: owneraddress ? owneraddress : list.owneraddress,
                email: email ? email : list.email,
                password: password ? password : list.password,
                phone: phone ? phone : list.phone,
              },
              { where: { id: id } }
            );
          }
          throw new RequestError("No data found", 409);
        })
        .then((e) => {
          res.status(200).json({ success: true, msg: "Updated Successfully" });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async storeDelete(req, res, next) {
    try {
      db.store
        .findOne({ where: { id: req.params.id } })
        .then((data) => {
          if (data) {
            return db.store.destroy({ where: { id: data.id } });
          }
          throw new RequestError("Seller is not found");
        })
        .then((re) => {
          return res
            .status(200)
            .json({ success: true, status: "deleted Product Successfully" });
        })
        .catch((err) => {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async storeProductDelete(req, res, next) {
    try {
      console.log("hi", req.body);
      db.store_product
        .findOne({ where: { id: req.body.id } })
        .then((data) => {
          if (data) {
            return db.store_product.destroy({ where: { id: req.body.id } });
          }
          throw new RequestError("Product is not found");
        })
        .then((re) => {
          return res.status(200).json({
            success: true,
            status: "Successfully deleted Product from store list",
          });
        })
        .catch((err) => {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },
};
