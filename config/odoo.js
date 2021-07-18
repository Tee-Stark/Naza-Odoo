const Odoo = require("odoo-await");

const odoo = new Odoo({
  baseUrl: "http://metricinternet-pricepoint-test-2753246.dev.odoo.com/xmlrpc/2/object",
  db: "metricinternet-pricepoint-test-2753246",
  port: 80,
  username: process.env.ODOO_USERNAME,
  //username: "kolade@abi-ng.com",
  password: process.env.ODOO_PASSWORD,
  //password: "Password@123"
});

odoo
  .connect()
  .then((res) => console.log(`Odoo DB connected: ${res}`))
  .catch((err) => console.log(`Error connecting: ${err}`));

  
module.exports = odoo;
