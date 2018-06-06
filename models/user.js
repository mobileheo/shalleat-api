const {
  Model
} = require('objection')
const knex = require('../db');

Model.knex(knex);

class User extends Model {
  static get tableName() {
    return 'users';
  }
  
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['firstName', 'lastName', 'provider'],

      properties: {
        id: { type: 'integer' },
        username: { type: 'string', minLength: 4, maxLength: 15},
        email: { type: ['string', 'null'] },
        firstName: { type: 'string', minLength: 1, maxLength: 50 },
        lastName: { type: 'string', minLength: 1, maxLength: 50 },
        provider: { type: ['string', 'null'] },
        created_at: { type: 'string', format: 'date-time'},
        updated_at: { type: 'string', format: 'date-time'}
      }
    };
  }

  static get relationMappings() {
    return {
      visitedRestaurants: {
        relation: Model.ManyToManyRelation,
        modelClass: __dirname + '/Restaurant',
        join: {
          from: 'users.id',
          through: {
            from: 'restaurants_customers.customerId',
            to: 'restaurants_customers.restaurantId'
          },
          to: 'restaurants.id'
        }
      }
    };
  }
};

module.exports = User;