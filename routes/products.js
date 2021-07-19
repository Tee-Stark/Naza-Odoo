const express = require("express");
const authorize = require("../middlewares/auth");
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
  searchProduct,
  getProductsByCategory,
} = require("../controllers/products");

router.get("/", getProducts);
router.post("/", authorize, createProduct);
router.get("/:id", getSingleProduct);
router.get("/filter", getProductsByFilters);
router.post("/search", searchProduct);
router.get("/bestselling", bestSellingProducts);;
router.put("/:id", authorize, updateProduct);
router.delete("/:id", authorize, deleteProduct);
router.get("/:id/related", getRelatedProducts);
router.post("/categories/create", authorize, addCategory);
router.get("/categories", getCategories);
router.get("/categories/:id", getProductsByCategory);

module.exports = router;
