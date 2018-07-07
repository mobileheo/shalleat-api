const { Model } = require("objection");
const bcrypt = require("bcryptjs");
const knex = require("../db");

Model.knex(knex);

const VALID_EMAIL_REGEX = "^([a-z0-9-_.]+@[a-z0-9-.]+.[a-z]{2,4})$";
const email = {
  type: ["object", "null"],
  properties: {
    email: {
      type: "string",
      pattern: VALID_EMAIL_REGEX
    }
  }
};

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["provider", "password", "firstName", "lastName"],
      properties: {
        id: { type: "integer" },
        email: {
          type: "string"
        },
        firstName: { type: "string", minLength: 1, maxLength: 50 },
        lastName: { type: "string", minLength: 1, maxLength: 50 },
        provider: {
          type: "object",
          properties: {
            local: {
              email
            },
            google: {
              email
            },
            facebook: {
              email
            },
            instagram: {
              email
            }
          }
        },
        geoLocation: {
          type: ["object", null],
          properties: {
            latitude: { type: "number" },
            longitude: { type: "number" }
          }
        },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" }
      }
    };
  }

  async $beforeInsert() {
    try {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(this.password, salt);

      this.password = passwordHash;
    } catch (error) {
      throw new Error(error);
    }
  }

  static get relationMappings() {
    return {
      visitedRestaurants: {
        relation: Model.ManyToManyRelation,
        modelClass: __dirname + "/restaurant",
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

  async isValidPassword(newPassword) {
    try {
      const isMatch = await bcrypt.compare(newPassword, this.password);
      // console.log(isMatch);
      return isMatch;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = User;
