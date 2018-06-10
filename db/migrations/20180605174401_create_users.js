exports.up = knex =>
  knex.schema.createTable("users", table => {
    table.increments("id").primary();
    table.string("provider").unique();
    // table.string("email").unique();
    table.string("firstName");
    table.string("lastName");
    table.string("password");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

exports.down = knex => knex.schema.dropTableIfExists("users");
