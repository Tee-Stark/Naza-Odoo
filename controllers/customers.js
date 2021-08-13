const odoo = require("../config/odoo");
const feedBack = require("../handler/feedbackHandler.js");
const bcrypt = require("bcryptjs");
const generateToken = require("../handler/authHandler.js");
const db = require('../config/db');
// create a new customer
const createCustomer = async (req, res) => {
  let { name, login, password } = req.body;
  if (!name || !login || !password) {
    // return error
    return await feedBack.failed(res, 400, "Missing required fields!", null);
  }
  try {
    const hash = await bcrypt.hash(password, 12);
    password = hash;
    const check_exists = await odoo.search("res.users", { login: login });
    if (check_exists.length > 0) {
      return await feedBack.failed(
        res,
        400,
        "User already exists! Pls use another e-mail...",
        null
      );
    }
    const user_id = await odoo.create("res.users", {
      name,
      login,
      password,
      email: login,
      customer: true,
      wallet_counts: 1,
      free_member: true,
    });
    const record = await db('users').insert({ login, password });
    if (!record) {
      return feedBack.failed(
        res,
        400,
        "Could not save Customer login details! Pls try again..."
      );
    }
    // return success
    await feedBack.success(res, 200, "Signup successful!", {
      user_id: user_id,
      token: await generateToken(user_id),
    });
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};

//login a customer
const loginCustomer = async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) {
    return await feedBack.failed(
      res,
      400,
      "Missing required fields! pls fill in all login details",
      null
    );
  }
  try {
    const verified = await db('users').where({ login: login }).first();
    const correctPwd = await bcrypt.compare(password, verified.password);
    if (verified && correctPwd) {
      const user = await odoo.searchRead(
        "res.users",
        { login: login, password: password },
        ["id", "name", "login"]
      );
      if (user) {
        return await feedBack.success(
          res,
          202,
          "Customer signed in successfully",
          {
            user,
            token: await generateToken(user[0].id),
          }
        );
      }
    } else {
      return await feedBack.failed(res, 404, "Invalid login credentials", null);
    }
  } catch (error) {
    await feedBack.failed(res, 500, error.mesage, error);
  }
};

// get single customers by ID
const getCustomerById = async (req, res) => {
  const id = req.params.id;
  const fields = req.query.fields
    ? req.query.fields.split(",")
    : [
        "name",
        "display_name",
        "email",
        "phone",
        "street",
        "street2",
        "city",
        "state_id",
        "country_id",
        "zip",
        "wallet_credits",
        "membership_type",
        "subscription_date",
        "expiry_date",
        "image",
      ];
  try {
    const result = await odoo.read("res.users", [parseInt(id)], fields);
    if (!result || result.length === 0) {
      return feedBack.failed(res, 404, "User does not exist!", null);
    }
    await feedBack.success(res, 200, "Customer returned successfully!", result);
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
// to get all customers
const getAllCustomers = async (req, res) => {
  try {
    const result = await odoo.read("res.users", [], ["name", "email"]);
    if (!result) {
      return await feedBack.failed(res, 404, "No record found", null);
    }
    await feedBack.success(
      res,
      200,
      "Customers returned successfully!",
      result
    );
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
//to update a customer
const updateCustomer = async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  try {
    let result = await odoo.update("res.users", [parseInt(id)], updates);
    if (!result) {
      return await feedBack.failed(
        res,
        304,
        "Unable to update customer profile!",
        null
      );
    }
    result = await odoo.read("res.users", [parseInt(id)], ["name", "login"]);
    await feedBack.success(
      res,
      200,
      "Successfully updated customer profile!",
      result
    );
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
const subscription = async (req, res) => {
  const id = req.params.id;
  const plan = req.body;
  try {
    const user = await odoo.searchRead('res.users', {"id": parseInt(id)}, [
      "name",
      "subscription_count"
    ]);
    const subscribed = await odoo.update("res.users", parseInt(id), {
      free_member: false,
      membership_amount: plan.amount,
      membership_state: "paid",
      membership_start: new Date(),
      membership_stop: new Date(
        new Date().setFullYear(new Date().getFullYear() + plan.years)
      ),
      membership_type: plan.type,
      subscription_date: new Date(),
      expiry_date: new Date(
        new Date().setFullYear(new Date().getFullYear() + plan.years)
      ),
      subscription_count: user[0].subscription_count + 1,
    });
    if (!subscribed) {
      return feedBack.failed(res, 400, "Subscription failed please try again!");
    }
    const record = await odoo.searchRead("res.users", { id: parseInt(id) }, [
      "membership_amount",
      "membership_type",
      "subscription_date",
      "expiry_date",
    ]);
    feedBack.success(
      res,
      200,
      `Membership subscription successful! Valid until ${record[0].expiry_date}`,
      record
    );
  } catch (err) {
    await feedBack.failed(res, 500, err.message, err);
  }
};
//to delete a customer
const deleteCustomer = async (req, res) => {
  const id = req.params.id;
  const fields = req.query.fields ? req.query.fields.split(",") : [];
  try {
    const deleted = await odoo.delete("res.users", parseInt(id), fields);
    if (!deleted) {
      return await feedBack.failed(res, 400, "Unable to delete customer", null);
    }
    await feedBack.success(res, 200, "Deleted successfully", deleted);
  } catch (error) {
    await feedBack.failed(res, 500, error.message, error);
  }
};
module.exports = {
  createCustomer,
  loginCustomer,
  getCustomerById,
  getAllCustomers,
  updateCustomer,
  subscription,
  deleteCustomer,
};
