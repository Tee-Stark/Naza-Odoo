const express = require("express");
const router = express.Router();
const {
    createSaleOrder,
    getSaleOrderById,
    getAllSaleOrders,
    deleteSaleOrer,
    checkoutSaleOrder
  } = require("../controllers/saleOrders");
const authorize = require("../middlewares/auth");

router.post("/", authorize, createSaleOrder);
router.get("/", authorize, getAllSaleOrders);
router.get("/:id", authorize, getSaleOrderById);
router.delete("/:id", authorize, deleteSaleOrer);
router.post("/checkout", authorize, checkoutSaleOrder);
module.exports = router;
