//view purchase orders
const odoo = require("../config/odoo");
const feedBack = require("../handler/feedbackHandler");
const checkout = require("./checkout.js");
const {checkoutOrder} = require("./checkout.js");
//create a new purchase order
const createPurchaseOrder = async (req, res) => {
  const { name, partner_id, amount_total, product_id } =
    req.body;
  const user_id = req.params.id;
  if (
    !user_id ||
    !name ||
    !partner_id ||
    !amount_total ||
    !product_id 
  ) {
    return await feedBack.failed(res, 400, "Missing required body!", null);
  }
  try {
    const order_id = await odoo.create("purchase.order", {
      name,
      partner_id,
      amount_total,
      user_id,
      product_id,
      //company_id,
    });
    if (!order_id) {
      return await feedBack.failed(res, 400, "Unable to create purchase order!", null);
    }
    await feedBack.success(
      res,
      200,
      `Purchase Order with ID ${order_id}, successfully created!`,
      { order_id: order_id }
    );
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
//get order details
const getPurchaseOrderById = async (req, res) => {
  const id = req.params.id;
  const fields = req.query.fields ? req.query.fields.split(",") : [];
  try {
    const result = await odoo.read("purchase.order", parseInt(id), fields);
    if (!result) {
      return await feedBack.failed(res, 404, "Order not found!", null);
    }
    await feedBack.success(res, 200, "Purchase Order returned successfully!", result);
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
//get a particular customers orders
const getUserPurchaseOrders = async (req, res) => {
  const customer_id = req.params.id;
  const fields = req.query.fields
    ? req.query.fields.split(",")
    : ["name", "product_id"];
  try {
    const result = await odoo.searchRead(
      "purchase.order",
      ["user_id", "=", `${customer_id}`],
      fields
    );
    if (!result) {
      return await feedBack.failed(res, 404, "Customer orders not found!", null);
    }
    await feedBack.success(
      res,
      200,
      "Customer Purchase Orders returned successfully!",
      result
    );
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
//delete order
const deletePurchaseOrder = async (req, res) => {
  const id = req.params.id;
  //const fields = req.query.fields ? req.query.fields.split(",") : [];
  try {
    const result = await odoo.delete("purchase.order", parseInt(id));
    if (!result) {
      return await feedBack.failed(res, 400, "Order not deleted!", null);
    }
    await feedBack.success(res, 200, "Purchase Order deleted successfully!", result);
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};

//checkout and pay for purchase
const checkoutPurchaseOrder = async (req, res) => {
  return checkout("purchase");
};

module.exports = {
  createPurchaseOrder,
  getPurchaseOrderById,
  getUserPurchaseOrders,
  deletePurchaseOrder,
  checkoutPurchaseOrder
};
