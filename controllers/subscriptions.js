const odoo = require("../config/odoo");
const feedBack = require("../handler/feedbackHandler.js");

//to subscribe to mailing list
exports.mailSubscribe = async (req, res) => {
  const { contact_id, list_id } = req.body;
  if (!contact_id || !list_id) {
    return await feedBack.failed(400, "Enter a valid email address", null);
  }
  
  const result = await odoo.create("mailing.contact.subscription", {
    contact_id,
    list_id,
  });
  if (!result) {
    return await feedBack.failed(
      res,
      304,
      "Unable to add customer to mailing list",
      null
    );
  }
  await feedBack.success(
    res,
    201,
    `Successfully added customer to mailing list!`,
    { mailing_id: result }
  );
};
