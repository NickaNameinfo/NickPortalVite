const express = require('express');
// const multer = require('multer');
// const path = require('path');
const storeController = require('./store.controller');
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


const storeRouter = express.Router();
// storeRouter.route('/create').post(sanitize(),validateBody(schemas.storeDetails),storeController.index);
storeRouter.route('/create').post(storeController.index);
storeRouter.route('/list').get(sanitize(), storeController.getAllstore);
storeRouter.route('/list/:id').get(sanitize(), storeController.getstoreStockById);
storeRouter.route('/product-list').get(sanitize(), storeController.getAllstoreProduct);
storeRouter.route('/product/getAllProductById').post(sanitize(), storeController.getProductBystore);
storeRouter.route('/update').post(sanitize(), storeController.storeUpdate);
storeRouter.route('/delete/:id').delete(sanitize(), storeController.storeDelete);
storeRouter.route('/product-delete').post(sanitize(), storeController.storeProductDelete);
storeRouter.route('/product-add').post(storeController.storeAddProduct);

module.exports = { storeRouter };
