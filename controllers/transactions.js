const odoo = require("../config/odoo");
const feedBack = require("../handler/feedbackHandler");

//view transactions per customer
const getTransactionsByCustomer = async (req, res) => {
  const id = req.params.id;
  //const fields = req.query.fields
  try {
    const result = await odoo.searchRead("account.payment", {
      partner_id: parseInt(id),
    });
    if (!result) {
      return await feedBack.failed(res, 404, "User has no transactions!", null);
    }
    await feedBack.success(
      res,
      200,
      "Successfully returned transactions",
      result
    );
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
//view transactions

const getTransactions = async (req, res) => {
  //const id = req.params.id;
  //const fields = req.query.fields;
  const fields = req.query.fields
    ? req.query.fields.split(",")
    : ["partner_id", "amount", "payment_method_id"];

  //console.log(`Fields => ${fields}`);
  try {
    const result = await odoo.searchRead("account.payment", {}, fields, {limit: 10, offset: 15});
    if (!result) {
      return await feedBack.failed(
        res,
        404,
        "No Transactions were found!",
        null
      );
    }
    await feedBack.success(
      res,
      200,
      "Successfully returned customers' transaction!",
      result
    );
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};

//get transaction by ID
const getTransactionById = async (req, res) => {
  const id = req.params.id;
  const fields = req.query.fields
    ? req.query.fields.split(",")
    : ["partner_id", "amount", "payment_method_id"];
  try {
    const result = odoo.searchRead("account.payment", ["id", "=", id], fields);
    if (!result) {
      return await feedBack.failed(res, 404, "Tansaction does not exist", null);
    }
    await feedBack.success(
      res,
      200,
      "Transaction returned successfully!",
      result
    );
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
module.exports = {
  getTransactionsByCustomer,
  getTransactions,
  getTransactionById,
};
