const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const {
  getProducts,
  getProductsByFilters,
  createProduct,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  addCategory,
  getRelatedProducts,
  getCategories,
  bestSellingProducts,
  searchProducts,
  getProductsByCategory,
} = require("../controllers/products");

router.get("/", getProducts);
router.post("/", createProduct);
router.get("/:id", getSingleProduct);
router.get("/filter", getProductsByFilters);
router.post("/search", searchProducts);
router.get("/bestselling", bestSellingProducts);;
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/:id/related", getRelatedProducts);
router.post("/categories/create", addCategory);
router.get("/categories", getCategories);
router.get("/categories/:id", getProductsByCategory);

module.exports = router;
