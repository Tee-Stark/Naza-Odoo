const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/auth.js");
const customers = require("../controllers/customers.js");
const subscription = require("../controllers/subscriptions.js");

router.post("/signup", customers.createCustomer);
router.post("/login", customers.loginCustomer);
router.put("/:id", authorize, customers.updateCustomer);
router.get("/", customers.getAllCustomers);
router.get("/:id", customers.getCustomerById);
router.post("/subscribe", subscription.mailSubscribe);
router.delete("/:id", authorize, customers.deleteCustomer);

module.exports = router;
