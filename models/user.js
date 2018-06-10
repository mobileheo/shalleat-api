const { Model } = require("objection");
const bcrypt = require("bcryptjs");
const knex = require("../db");

Model.knex(knex);

const VALID_EMAIL_REGEX = "^([a-z0-9-_.]+@[a-z0-9-.]+.[a-z]{2,4})$";

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "password", "firstName", "lastName"],
      properties: {
        id: { type: "integer" },
        email: {
          type: "string",
          pattern: VALID_EMAIL_REGEX
        },
        firstName: { type: "string", minLength: 1, maxLength: 50 },
        lastName: { type: "string", minLength: 1, maxLength: 50 },
        provider: { type: ["string"] },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" }
      }
    };
  }

  static get relationMappings() {
    return {
      visitedRestaurants: {
        relation: Model.ManyToManyRelation,
        modelClass: __dirname + "/Restaurant",
        join: {
          from: "users.id",
          through: {
            from: "restaurants_customers.customerId",
            to: "restaurants_customers.restaurantId"
          },
          to: "restaurants.id"
        }
      }
    };
  }
}

module.exports = User;
