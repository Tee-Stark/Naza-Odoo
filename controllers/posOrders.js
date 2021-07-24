const odoo = require("../config/odoo.js");
const feedBack = require("../handler/feedbackHandler.js");
//------------ NOT SO IMPORTANT ENDPOINTS ------------//
//----ONLY USED TO CREATE A POS AND OPEN A SESSION FOR TESTING -----//
//to configure a new point of sale
const createPos = async (req, res) => {
  const config = {
    name: "Test POS",
    currency_id: 123,
  };
  try {
    const pos_id = await odoo.create("pos.config", config);
    if (!pos_id) {
      return await feedBack.failed(res, 500, "Unable to create new POS", null);
    }
    const pos = await odoo.read("pos.config", parseInt(pos_id));
    await feedBack.success(
      res,
      200,
      `New POS with ID: ${pos_id} successfully created!`,
      pos
    );
  } catch (error) {
    return await feedBack.failed(res, 500, error.message, error);
  }
};

//to create a new POS session
const makeSession = async (req, res) => {
  const { name, pos_id, user_id } = req.body;
  if (!name || !pos_id || !user_id) {
    return await feedBack.failed(res, 400, "Missing required body!", null);
  }
  const config = {
    config_id: pos_id,
    name,
    user_id,
  };
  try {
    const result = await odoo.create("pos.session", config);
    if (!result) {
      return await feedBack.failed(
        res,
        500,
        "Unable to create new session!",
        null
      );
    }
    const data = await odoo.read("pos.order", parseInt(result));
    console.log(data);
    await feedBack.success(
      res,
      200,
      `New session ${name} with ID: ${result}, created successfully!`,
      data
    );
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
const closeSession = async (req, res) => {
  try {
    const session_id = req.params.id;
    const session = await odoo.read("pos.session", parseInt(session_id));
    if (!session) {
      return await feedBack.failed(
        res,
        400,
        "Session is either closed or does not exist!",
        null
      );
    }
    const closed = await odoo.update(
      "pos.session",
      { id: session_id },
      { state: closed }
    );
    if (!closed) {
      return await feedBack.failed(
        res,
        400,
        "you cannot close this session!",
        null
      );
    }
    await feedBack.success(res, 200, "Session closed successfully!", closed);
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
//----------------------MAIN POS ORDER ENDPOINTS------//
const makeOrder = async (req, res) => {
  const {
    user_id,
    name,
    session_id,
    partner_id,
    pricelist_id,
    amount_paid,
    amount_total,
    amount_tax,
    amount_return,
  } = req.body;
  /*
  if (
    !user_id ||
    !pos_reference ||
    !session_id ||
    !partner_id ||
    !pricelist_id ||
    !amount_paid ||
    !amount_total ||
    !amount_tax
  ) {
    return await feedBack.failed(res, 400, "Missing required body!", null);
  }*/
  try {
    const result = await odoo.create("pos.order", {
      user_id,
      name,
      session_id,
      partner_id,
      pricelist_id: 3,
      amount_paid,
      amount_total,
      amount_tax,
      amount_return,
      pos_reference: name,
    });
    if (!result) {
      return await feedBack.failed(res, 400, "Unable to make new order!", null);
    }
    const result2 = await odoo.read("pos.order", parseInt(result), [
      "pos_reference",
      "amount_total",
    ]);
    await feedBack.success(
      res,
      200,
      `New order with ID: ${result} was successfully made`,
      result2
    );
  } catch (error) {
    return await feedBack.failed(res, 500, error.message, error);
  }
};
//checkout for an order
const checkoutOrder = async (req, res) => {
  const pos_order_id = req.params.id;
  const {
      name,
      user_id,
      partner_id,
      amount,
      payment_method_id,
    } = req.body;
    if (
      !name ||
      !partner_id ||
      !amount ||
      !payment_method_id
    ) {
      return await feedBack.failed(res, 400, "Missing required body!", null);
    }
  
    try {
      //first create an account move, for valid payment
      const move_id = await odoo.create("account.move", {
        name,
        state: "posted",
        journal_id: 2,
        user_id,
      })
      //make a payment with the generated move
      const payment = await odoo.create("account.payment", {
        move_id,
        payment_type: "outbound",
        partner_type: "customer",
        partner_id,
        amount,
        journal_id: 2,
        payment_method_id,
        currency_id: 123,
      });
      if(!payment) {
        return await feedBack.failed(res, 400, "Payment Unsuccessful", null);
      }
      //if payment was successful, update the move's payment state to paid
      await odoo.update("account.move", parseInt(move_id), {payment_state: "paid"});
      console.log(`Payment successful, ID => ${payment}`);
      const result = await odoo.update("pos.order", parseInt(pos_order_id), {
      state: "paid",
      note: "Thanks! your delivery is now in progress!",
      pos_order_id,
      move_id,
      amount_paid: amount,
    });
    if (!result) {
      return await feedBack.failed(
        res,
        400,
        "Unable to checkout for this order!",
        null
      );
    }
    await feedBack.success(
      res,
      200,
      "Successfully checked out order, your delivery is now in progress!",
      result
    );
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
const getUserOrders = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await odoo.searchRead("pos.order", [
      "user_id",
      "=",
      parseInt(id),
    ]);
    if (!result || result.length <= 0) {
      return await feedBack.failed(res, 400, "User has no orders!", null);
    }
    return await feedBack.success(
      res,
      200,
      "All user orders returned successfully!",
      result
    );
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
module.exports = {
  createPos,
  makeSession,
  makeOrder,
  checkoutOrder,
  getUserOrders,
};
