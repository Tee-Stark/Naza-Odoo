const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/auth.js")

const {
     getTransactions,
     getTransactionById,
     getTransactionsByCustomer
} = require("../controllers/transactions");

router.get("/", getTransactions);
router.get("/:id", getTransactionById);
router.get("/partners/:id", getTransactionsByCustomer);

module.exports = router;
