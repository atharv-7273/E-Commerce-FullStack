const protect = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();

const {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct
} = require("../controllers/productController");

router.get("/", getProducts);
router.post("/", protect, addProduct);
router.delete("/:id", protect, deleteProduct);
router.put("/:id", protect, updateProduct);


module.exports = router;
