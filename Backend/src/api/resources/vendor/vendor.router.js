const express = require('express');
// const multer = require('multer');
// const path = require('path');
const vendorController = require('./vendor.controller');
const { sanitize } = require('../../../middleware/sanitizer');
const { jwtStrategy } = require('../../../middleware/strategy');
const { validateBody, schemas } = require('../../../middleware/validator');
// var attachmentDir = path.join(path.dirname(require.main.filename), 'public', 'images','product')

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, attachmentDir) 
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + path.extname(file.originalname))
//     }
//   })
// var uploadAttachment = multer({ storage: storage, limits:{ fileSize: 10485760 }})


const vendorRouter = express.Router();
// vendorRouter.route('/create').post(sanitize(),validateBody(schemas.vendorDetails),vendorController.index);
vendorRouter.route('/create').post(vendorController.index);
vendorRouter.route('/list').get(sanitize(), jwtStrategy, vendorController.getAllvendor);
vendorRouter.route('/product-list').get(sanitize(), vendorController.getAllVendorProduct);
vendorRouter.route('/product/getAllProductById').post(sanitize(), vendorController.getProductByVendor);
vendorRouter.route('/update').post(sanitize(), vendorController.vendorUpdate);
vendorRouter.route('/delete').delete(sanitize(), vendorController.vendorDelete);
vendorRouter.route('/product-delete').post(sanitize(), vendorController.vendorProductDelete);
vendorRouter.route('/product-add').post(vendorController.vendorAddProduct);

module.exports = { vendorRouter };
