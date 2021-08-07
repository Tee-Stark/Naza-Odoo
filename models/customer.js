const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
  login: { type: String, required: true, lowercase: true, unigue: true },
  password: { type: String, required: true }
});

module.exports = Customer = mongoose.model("Customers", customerSchema);