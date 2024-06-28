const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const multer = require("multer");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder for file uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // File naming scheme
  },
});

// Multer upload instance with storage configuration
const upload = multer({ storage: storage });

// Routes for products
router.get("/", productController.findAll); // GET all products
router.get("/:id", productController.findById); // GET product by ID
router.post("/", upload.single("image"), productController.create); // POST create a new product
router.put("/:id", upload.single("image"), productController.updateById); // PUT update a product by ID
router.delete("/:id", productController.deleteById); // DELETE delete a product by ID

module.exports = router;
