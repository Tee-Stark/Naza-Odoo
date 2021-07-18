const odoo = require("../config/odoo.js");
const feedBack = require("../handler/feedbackHandler.js");

// checkout or make a payment
const checkout = orderType => {
    let partner_type;
    switch(orderType)
    {
        case "sale": partner_type = "supplier";
        return;
        case "purchase": partner_type = "customer";
        return;
    }
    const callback = async (req, res) => {
    const {
      partner_bank_id,
      partner_id,
      amount,
      payment_type,
      payment_method_id,
      currency_id,
    } = req.body;
    if (
      !payment_type ||
      !partner_id ||
      !amount ||
      !partner_type ||
      !partner_bank_id ||
      !payment_method_id
    ) {
      return await feedBack.failed(res, 400, "Missing required body!", null);
    }
  
    try {
      const result = await odoo.create("account.payment", {
        move_id,
        payment_type,
        partner_type,
        partner_id,
        amount,
        payment_method_id,
        currency_id,
      });
      return await feedBack.failed(
        res,
        201,
        `Checkout with ID: ${result} created successfully!`,
        result
      );
    } catch (error) {
      await feedBack.failed(res, 500, error.message, error);
    }
  };
  return callback;
};

module.exports = checkout;