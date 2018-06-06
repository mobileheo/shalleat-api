const {
  Model,
  ValidationError
} = require('objection')
const knex = require('../db');

Model.knex(knex);

let isEmail = email => /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test( email );	


class User extends Model {
  static get tableName() {
    return 'users';
  }

  $beforeInsert() {
    if (isEmail(this.email)) {
      throw new ValidationError({
        message: 'The email you entered is invalid, please try again.',
        type: 'invalidEmail',
        data: {
          foo: "whatever"
        }
      });
    }
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