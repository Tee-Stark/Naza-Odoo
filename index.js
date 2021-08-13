const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
//require('./config/db');
require("dotenv").config();

// routes
const products = require("./routes/products");
const customers = require("./routes/customers");
const transactions = require("./routes/transactions");
const purchaseOrders = require("./routes/purchaseOrders");
const saleOrders = require("./routes/saleOrders");
const posOrders = require("./routes/posOrder");
// middlewares
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");

// app
const app = express();

// port
const port = process.env.PORT || 3080;

app.use(logger("dev"));
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/products", products);
app.use("/api/customers", customers);
app.use("/api/transactions", transactions) 
app.use("/api/orders/purchase", purchaseOrders);
app.use("/api/orders/sale", saleOrders);
app.use("/api/pos/", posOrders);
// error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
