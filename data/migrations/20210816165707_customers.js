
exports.up = function(knex) {
  return knex.schema.createTable("customers", tbl => {
    tbl.increments('id').primary();
    tbl.string('login', 255).unique().notNullable();
    tbl.string('password', 255).notNullable();
  })
  .then(()=> console.log("Customers table created successfully!"));
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tbl')
  .then(()=> console.log("Customers table deleted!"));
};
