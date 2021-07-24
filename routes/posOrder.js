const { makeOrder, createPos, makeSession, checkoutOrder, getUserOrders } = require("../controllers/posOrders.js");
const router = require("express").Router();

router.post("/order", makeOrder);
router.post("/:id/checkout", checkoutOrder)
router.post("/", createPos);
router.post("/session", makeSession);
router.get("/myOrders/:id", getUserOrders)
module.exports = router;
