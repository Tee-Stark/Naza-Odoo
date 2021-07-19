const express = require("express");
const authorize = require("../middlewares/auth.js")
const router = express.Router();
const {
  createPurchaseOrder,
  getPurchaseOrderById,
  getUserPurchaseOrders,
  deletePurchaseOrder,
  checkoutPurchaseOrder,
} = require("../controllers/purchaseOrders");

router.post("/:id/create", authorize, createPurchaseOrder);
router.get("/:id/show", authorize, getPurchaseOrderById);
router.get("/:id", authorize, getUserPurchaseOrders);
router.delete("/:id", authorize, deletePurchaseOrder)
router.post("/checkout", authorize, checkoutPurchaseOrder);

module.exports = router;