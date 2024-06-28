const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.post("/", categoryController.create);
router.get("/", categoryController.findAll);
router.get("/:id", categoryController.findById);
router.put("/:id", categoryController.updateById);
router.delete("/:id", categoryController.deleteById);

module.exports = router;
