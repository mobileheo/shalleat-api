exports.up = knex => 
  knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('username').unique();
    table.string('email');
    table.string('first_name');
    table.string('last_name');
    table.string('password');
    table.string('provider');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });


exports.down = knex => knex.schema.dropTableIfExists('users');