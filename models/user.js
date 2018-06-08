const { Model, ValidationError } = require("objection");
const knex = require("../db");

Model.knex(knex);

let isEmail = email =>
  email.match(
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  );

class User extends Model {
  static get tableName() {
    return "users";
  }

  $beforeInsert() {
    if (!isEmail(this.email)) {
      throw new ValidationError({
        message: "The email you entered is invalid, please try again.",
        type: "invalidEmail",
        data: {
          inserted: this.email
        }
      });
    }
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["firstName", "lastName", "provider"],
      properties: {
        id: { type: "integer" },
        email: { type: ["string", "null"] },
        firstName: { type: "string", minLength: 1, maxLength: 50 },
        lastName: { type: "string", minLength: 1, maxLength: 50 },
        provider: { type: ["string", "null"] },
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
