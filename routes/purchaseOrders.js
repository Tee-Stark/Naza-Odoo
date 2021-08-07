const express = require("express");
const authorize = require("../middlewares/auth.js")
const router = express.Router();
const {
  createPurchaseOrder,
  getPurchaseOrderById,
  getUserPurchaseOrders,
  deletePurchaseOrder
} = require("../controllers/purchaseOrders");

router.post("/:id/create", createPurchaseOrder);
router.get("/:id/show", getPurchaseOrderById);
router.get("/:id", getUserPurchaseOrders);
router.delete("/:id", deletePurchaseOrder)


module.exports = router;