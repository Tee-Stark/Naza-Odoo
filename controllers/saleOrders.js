const odoo = require("../config/odoo");
const feedBack = require("../handler/feedbackHandler.js");

// create new sale order -- a sale order gets most of its properties from the purchase order made by the customer
const createSaleOrder = async (req, res) => {
  const {
    name,
    user_id,
    partner_id
  } = req.body;
  if (
    !name ||
    !user_id ||
    !partner_id 
  ) {
    return await feedBack.failed(res, 400, "Missing required body!", null);
  }
  try {
    const result1 = await odoo.create("sale.order", {
      name,
      user_id,
      partner_id,
    });
    //const result2 = await odoo.create("sale.order.line", {});
    if (!result1) {
      return await feedBack.failed(res, 400, "Unable to create new sale order!", null);
    }
    await feedBack.success(
      res,
      201,
      `New Sale Order ${result1} created successfully!`,
      result1
    );
  } catch (error) {
    await feedBack.success(res, 500, error.message, error);
  }
};

const getSaleOrderById = async (req, res) => {
  const id = req.params.id;
  try {
    const sale_order = await odoo.read("sale.order", parseInt(id));
    if (!sale_order) {
      return await feedBack.failed(res, 404, "Order not found!", null);
    }
    await feedBack.success(res, 200, "Sale order returned successfully!", sale_order);
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
//get all sale orders
const getAllSaleOrders = async (req, res) => {
  try {
    const saleOrders = await odoo.read("sale.order");
    if (!saleOrders) {
      return await feedBack.failed(res, 404, "No sale orders found!", null);
    }
    await feedBack.success(res, 200, "Sale orders returned succesfully!", saleOrders);
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
//delete a sale order
const deleteSaleOrer = async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await odoo.delete("sale.order", parseInt(id));
    if (!deleted) {
      return await feedBack.failed(res, 400, `Unable to delete sale order ${id}!`, null);
    }
    await feedBack.success(res, 200, `Successfully deleted sale order ${id}`);
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};

//checkout an order
module.exports = {
  createSaleOrder,
  getSaleOrderById,
  getAllSaleOrders,
  deleteSaleOrer,
};
