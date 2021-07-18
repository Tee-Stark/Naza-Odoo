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

router.post("/", createSaleOrder);
router.get("/", getAllSaleOrders);
router.get("/:id", getSaleOrderById);
router.delete("/:id", deleteSaleOrer);
//router.post("/checkout", authorize, checkoutSaleOrder);
module.exports = router;
