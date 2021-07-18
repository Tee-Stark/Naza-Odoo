const express = require("express");
const authorize = require("../middlewares/auth.js")
const router = express.Router();
const {
  createPurchaseOrder,
  getPurchaseOrderById,
  getUserPurchaseOrders,
  deletePurchaseOrder,
  //checkoutPurchaseOrder,
} = require("../controllers/purchaseOrders");

router.post("/:id/create", createPurchaseOrder);
router.get("/:id/show", getPurchaseOrderById);
router.get("/:id", getUserPurchaseOrders);
router.delete("/:id", deletePurchaseOrder)
//router.post("/checkout", authorize, checkoutPurchaseOrder);

module.exports = router;