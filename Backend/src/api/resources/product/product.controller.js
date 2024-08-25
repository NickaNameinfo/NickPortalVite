const { Op } = require("sequelize");
// const { queue } = require("../../../kue");
const config = require("../../../config");
const AWS = require("aws-sdk");
const db = require("../../../models");
const BUCKET_NAME = "bangmobileapplication";

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: "ap-south-1", // Replace with your AWS region
  credentials: {
    accessKeyId: "AKIAY55VZUUB7ZDB7JTP",
    secretAccessKey: "GWRlhht3W4ZNsQ3c5mc2yv839XsG+i6uT6F/1ti2",
  },
});

var deleteFileFromS3 = async (imgUrl) => {
  try {
    const lastItem = imgUrl.substring(imgUrl.lastIndexOf("/") + 1);
    var params = {
      Bucket: "photoabhi",
      Key: lastItem,
    };
    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (error, data) => {
        if (error) {
          console.log(error, error.stack);
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  } catch (error) {
    console.log(error);
    throw new Error("Promise error");
  }
};

module.exports = {
  /* Add user api start here................................*/

  async addProduct(req, res, next) {
    try {
      const {
        categoryId,
        subCategoryId,
        childCategoryId,
        name,
        slug,
        brand,
        status,
        unitSize,
        sortDesc,
        desc,
        buyerPrice,
        price,
        qty,
        discount,
        discountPer,
        total,
        netPrice,
        paymentMode,
        createdId,
        createdType,
      } = req.body;
      return db.product
        .create({
          categoryId: Number(categoryId),
          subCategoryId: Number(subCategoryId),
          childCategoryId: Number(childCategoryId),
          name: name,
          slug: slug,
          status: status,
          brand: brand,
          unitSize: unitSize,
          sortDesc: sortDesc,
          desc: desc,
          buyerPrice: buyerPrice,
          price: price,
          qty: qty,
          discount: discount,
          discountPer: discountPer,
          total: total,
          netPrice: netPrice,
          paymentMode: paymentMode,
          photo: req?.file ? req?.file?.path : "",
          createdId: createdId,
          createdType: createdType,
        })
        .then((product) => {
          res.status(200).json({
            success: true,
            msg: "Successfully inserted product",
            data: product,
          });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async index(req, res, next) {
    try {
      const { supplierId, categoryId, subCategoryId } = req.query;
      db.product
        .findAll({
          order: [["createdAt", "DESC"]],
          where: {
            supplierId: supplierId,
            categoryId: categoryId,
            subCategoryId: subCategoryId,
          },
        })
        .then((product) => {
          res.status(200).json({ success: true, product });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async getAllProductList(req, res, next) {
    try {
      db.product
        .findAll({
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: db.subcategories,
              attributes: ["id", "sub_name"],
              include: [
                {
                  model: db.category,
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        })
        .then((products) => {
          res.status(200).json({ success: true, data: products });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async update(req, res, next) {
    try {
      const {
        id,
        productId,
        categoryId,
        subCategoryId,
        childCategoryId,
        name,
        slug,
        brand,
        status,
        unitSize,
        desc,
        buyerPrice,
        price,
        qty,
        discount,
        discountPer,
        total,
        netPrice,
        paymentMode,
        createdId,
        createdType,
      } = req.body;
      db.product
        .findOne({ where: { id: id } })
        .then((product) => {
          if (product) {
            return db.product.update(
              {
                categoryId: categoryId ? categoryId : product.categoryId,
                subCategoryId: subCategoryId
                  ? subCategoryId
                  : product.subCategoryId,
                childCategoryId: childCategoryId
                  ? childCategoryId
                  : product.childCategoryId,
                name: name ? name : product.name,
                slug: slug ? slug : product.slug,
                status: status,
                brand: brand ? brand : product?.brand,
                unitSize: unitSize ? unitSize : product.unitSize,
                desc: desc,
                buyerPrice: buyerPrice,
                price: price,
                qty: qty,
                discount: discount,
                discountPer: discountPer,
                total: total,
                netPrice: netPrice,
                paymentMode: paymentMode,
                photo: req.file ? req.file.location : product.photo,
                createdId: createdId,
                createdType: createdType,
              },
              { where: { id: product.id } }
            );
          }
          throw new RequestError("Not Found Product", 409);
        })
        .then((p) => {
          res.status(200).json({ success: true, msg: "Updated Successfully" });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async getProductListByCategory(req, res, next) {
    try {
      db.product
        .findAll({
          order: [["createdAt", "DESC"]],
          where: {
            categoryId: req.query.categoryId,
            subCategoryId: req.query.subCategoryId,
          },
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
  async getProductListById(req, res, next) {
    try {
      const product = await db.product.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: db.productphoto,
            attributes: ["id", "imgUrl"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      res.status(200).json({ success: true, data: product });
    } catch (err) {
      next(err); // Pass the error to the next middleware or error handler
    }
  },

  async getWebProductListById(req, res, next) {
    try {
      db.product
        .findOne({
          where: { id: req.params.id },
          include: [{ model: db.productphoto, attributes: ["id", "imgUrl"] }],
          order: [["createdAt", "DESC"]],
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
  async addProductOffer(req, res, next) {
    try {
      const { productId, qty, discount_per, discount_price, total, net_price } =
        req.body;
      db.ProductOffer.findOne({ where: { id: productId } })
        .then((list) => {
          if (!list) {
            return db.ProductOffer.create({
              productId: productId,
              image: req.file ? req.file.location : "",
              qty: qty,
              discount_per: discount_per,
              discount_price: discount_price,
              total: total,
              net_price: net_price,
            });
          } else {
            return db.ProductOffer.update(
              {
                qty: qty,
                discount_per: discount_per,
                discount_price: discount_price,
                total: total,
                net_price: net_price,
              },
              { where: { id: list.id } }
            );
          }
        })
        .then((p) => {
          res.status(200).json({ success: true, msg: "Successfully" });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async getProductOffer(req, res, next) {
    try {
      db.ProductOffer.findAll({
        include: [
          {
            model: db.product,
            attributes: [
              "id",
              "categoryId",
              "price",
              "item_name",
              "description",
              "brand",
            ],
            include: [{ model: db.category, attributes: ["id", "name"] }],
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

  async searchProductBySubCat(req, res, next) {
    try {
      db.subcategories
        .findOne({
          where: { sub_name: req.body.subCat },
        })
        .then((data) => {
          if (data) {
            return db.product.findAll({
              where: { subCategoryId: data.id },
            });
          }
        })
        .then((list) => {
          console.log(JSON.stringify(list));
          res.status(200).json({ success: true, data: list });
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async productDelete(req, res, next) {
    db.product
      .findOne({ where: { id: parseInt(req.query.id) } })
      .then((product) => {
        if (product) {
          return db.product.destroy({ where: { id: product.id } });
        }
        throw new RequestError("Product is not found");
      })
      .then((re) => {
        return res.status(200).json({ status: "deleted Product Seccessfully" });
      })
      .catch((err) => {
        next(err);
      });
  },

  async productOfferDelete(req, res, next) {
    db.ProductOffer.findOne({ where: { id: parseInt(req.params.id) } })
      .then((product) => {
        if (product) {
          return db.ProductOffer.destroy({ where: { id: product.id } });
        }
        throw new RequestError("Product is not found");
      })
      .then((re) => {
        return res.status(200).json({ status: "deleted Product Seccessfully" });
      })
      .catch((err) => {
        next(err);
      });
  },

  async multiplePhotoUpload(req, res, next) {
    let attachmentEntries = [];
    var productId = req.body.productId;
    for (var i = 0; i < req.files.length; i++) {
      attachmentEntries.push({
        productId: productId,
        name: req.files[i].filename,
        mime: req.files[i].mimetype,
        imgUrl: req.files[i].location,
      });
    }

    db.product
      .findOne({
        where: { id: productId },
      })
      .then((r) => {
        if (r) {
          return null;
          // .create("img-upload", {
          //   productId: productId,
          //   productName: r.item_name,
          //   attachmentEntries: attachmentEntries,
          // })
          // .save();
        }
        throw new RequestError("ProductId is not found");
      })
      .then((r) => {
        res.status(200).json({ success: r });
      })
      .catch(function (error) {
        console.log(error);
        res.status(500).json({ errors: ["Error insert photo"] });
      });
  },

  async getAllPhoto(req, res, next) {
    try {
      db.product
        .findAll({
          order: [["createdAt", "DESC"]],
          attributes: ["id", "name", "brand"],
          include: [{ model: db.productphoto, attributes: ["id", "imgUrl"] }],
        })
        .then((data) => {
          res.status(200).json({ success: true, data });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },
  async deleteSliderPhoto(req, res, next) {
    db.productphoto
      .findOne({ where: { id: parseInt(req.query.id) } })
      .then((product) => {
        if (product) {
          return db.productphoto.destroy({ where: { id: req.query.id } });
        }
        throw new RequestError("Product is not found");
      })
      .then((re) => {
        return res.status(200).json({ status: "deleted Product Seccessfully" });
      })
      .catch((err) => {
        next(err);
      });
  },
  //All GroceryStample product
  async getAllGrocerryStaples(req, res, next) {
    try {
      db.category
        .findOne({
          attributes: ["id", "slug"],
          where: { slug: "grocery-staple" },
          include: [
            {
              model: db.product,
              order: [["createdAt", "DESC"]],
              include: [
                { model: db.productphoto, attributes: ["id", "imgUrl"] },
              ],
            },
          ],
        })
        .then((product) => {
          res.status(200).json({ success: true, data: product });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async getAllProductBySlug(req, res, next) {
    try {
      db.category
        .findOne({
          attributes: ["id", "slug"],
          where: { slug: req.params.slug },
          include: [
            {
              model: db.product,
              order: [["createdAt", "DESC"]],
              include: [
                { model: db.productphoto, attributes: ["id", "imgUrl"] },
              ],
            },
          ],
        })
        .then((product) => {
          res.status(200).json({ success: true, data: product });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  // filter product

  async getFilterbyProduct(req, res, next) {
    try {
      let search = "%%";
      if (req.query.search) {
        search = "%" + req.query.search + "%";
      }
      db.subcategories
        .findAll({
          attributes: ["id", "sub_name"],
          include: [
            {
              model: db.product,
              order: [["createdAt", "DESC"]],
              required: true,
              where: {
                [Op.or]: [
                  { name: { [Op.like]: search }, slug: { [Op.like]: search } },
                ],
              },
            },
          ],
        })

        .then((product) => {
          res.status(200).json({ success: true, data: product });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async GetAllByCategory(req, res, next) {
    try {
      db.subcategories
        .findOne({
          where: { sub_name: req.body.name },
          include: [
            {
              model: db.subchildcategories,
              include: [
                {
                  model: db.product,
                  order: [["createdAt", "DESC"]],
                  include: [
                    { model: db.productphoto, attributes: ["id", "imgUrl"] },
                  ],
                },
              ],
            },
          ],
        })
        .then((product) => {
          res.status(200).json({ success: true, data: product });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  // aws image delete
  async awsProductPhotoDelete(req, res, next) {
    try {
      const { id, imgUrl } = req.body;
      deleteFileFromS3(imgUrl)
        .then((data) => {
          if (!data) {
            return db.productphoto.destroy({ where: { id: id } });
          }
          throw new RequestError("error");
        })
        .then((success) => {
          res.status(200).json({
            success: true,
            msg: "Successflly deleted image from s3 Bucket",
          });
        });
    } catch (err) {
      next(err);
      // res.status(500).json({'success':false, msg: err})
    }
  },

  async getProductSubChildCat(req, res, next) {
    try {
      const { subCategoryId, childCategoryId } = req.body;
      db.product
        .findAll({
          where: {
            childCategoryId: childCategoryId,
            subCategoryId: childCategoryId,
          },
        })
        .then((product) => {
          res.status(200).json({ success: true, data: product });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      next(err);
      // res.status(500).json({ 'success':false, msg: err})
    }
  },
};
