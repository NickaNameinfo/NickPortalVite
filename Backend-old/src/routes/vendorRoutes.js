const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes
router.get('/', vendorController.findAll);
router.get('/:id', vendorController.findById);
router.post('/', upload.fields([{ name: 'vendor_image', maxCount: 1 }, { name: 'vendor_document', maxCount: 1 }]), vendorController.create);
router.put('/:id', upload.fields([{ name: 'vendor_image', maxCount: 1 }, { name: 'vendor_document', maxCount: 1 }]), vendorController.updateById);
router.delete('/:id', vendorController.deleteById);

module.exports = router;
