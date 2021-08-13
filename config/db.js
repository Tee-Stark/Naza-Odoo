//mongodb+srv://OdooAPI:<password>@cluster0.qytxo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const knex = require('knex');

const knexfile = require('../knexfile');


const env = process.env.NODE_ENV;
const configOptions = knexfile[env];

module.exports = knex(configOptions);