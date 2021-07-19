const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/auth.js")

const {
     getTransactions,
     getTransactionById,
     getTransactionsByCustomer
} = require("../controllers/transactions");

router.get("/", authorize, getTransactions);
router.get("/:id", authorize, getTransactionById);
router.get("/partners/:id",authorize, getTransactionsByCustomer);

module.exports = router;
