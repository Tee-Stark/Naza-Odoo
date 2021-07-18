const jwt = require("jsonwebtoken");
const odoo = require("../config/odoo");
const feedBack = require("./feedbackHandler.js");
const config = process.env;

const secret = config.JWT_SECRET || "verySecretValue";

module.exports = generateToken = async (user_id) => {
  const validUser = await odoo.searchRead(
    "res.users",
    { id: parseInt(user_id) },
    ["id", "login"]
  );
  if (!validUser) return feedBack.message.failed;
  let { id, login } = validUser[0]; // validUser[0] means the first object in the array in case there is more to avoid errors
  id = id.toString();
  payload = { id, login };
  const options = { expiresIn: "24hrs" };
  const token = await jwt.sign(payload, secret, options);
  return token;
};
