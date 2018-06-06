exports.up = knex => 
  knex.schema.createTable('restaurants_customers', table => {
    table.increments('id').primary();
    table
      .integer('customerId')
      .references('users.id')
      .onDelete('CASCADE');
    table
      .integer('restaurantId')
      .references('restaurants.id')
      .onDelete('CASCADE');
    table.unique(['customerId', 'restaurantId']);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });


exports.down = knex => knex.schema.dropTableIfExists('restaurants_customers');
