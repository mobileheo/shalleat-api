exports.up = knex => 
  knex.schema.createTable('restaurants', table => {
    table.increments('id').primary();
    table.string('name');
    table.text('description');
    table.string('phoneNumber');
    table.json('geoLocation');
    table.json('address');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  
exports.down = knex => knex.schema.dropTableIfExists('restaurants');
