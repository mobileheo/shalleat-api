const bcrypt = require("bcrypt");
const saltRounds = 10;
const VALID_EMAIL_REGEX = "^([a-z0-9-_.]+@[a-z0-9-.]+.[a-z]{2,4})$";
const { User, Restaurant } = require("../../../models/schema");
const faker = require("faker");
const provinces = [
  "British Columbia",
  "Ontario",
  "Newfoundland",
  "Nova Scotia",
  "Prince Edward Island",
  "New Brunswick",
  "Quebec",
  "Manitoba",
  "Saskatchewan",
  "Alberta",
  "Northwest Territories",
  "Nunavut",
  "Yukon Territory"
];
// const adminUser = {
//   firstName: "Sunny",
//   lastName: "Heo",
//   email: "sunny@admin.com",
//   password: "superSecret1@",
//   provider: "local"
// };
// const defualtUser = async () => await User.query().insert(adminUser);

const email = () => {
  const fakerEmail = faker.internet.email();

  const [validEmail, ...rest] = fakerEmail
    .toLowerCase()
    .match(VALID_EMAIL_REGEX);
  return validEmail;
};

const createUsers = iteration =>
  [...Array(iteration)].map(user => {
    return {
      email: email(),
      password: faker.internet.password(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      provider: ["google", "facebook", "instagram"][~~(Math.random() * 3)]
    };
  });
const createRestaurants = iteration => {
  [...Array(iteration)].map(restaurants => {
    return {
      name: faker.company.companyName(),
      description: faker.company.bsBuzz(),
      phoneNumber: faker.phone.phoneNumber(),
      geoLocation: {
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude()
      },
      address: {
        street: faker.address.streetAddress(),
        city: faker.address.city(),
        province: provinces[~~(Math.random() * provinces.length)],
        zipCode: faker.address.zipCode()
      }
    };
  });
};

// const createRestCust = (knex, customerId, restaurantId) => {
//   return knex("restaurants_customers").insert({
//     customerId,
//     restaurantId
//   });
// };
const createCustomers = async (userId, restaurantId) => {
  try {
    const compositeKey = { userId, restaurantId };
    const customer = await restaurants_customers.query().insert(compositeKey);
  } catch (error) {
    console.log(error);
  }
};
exports.seed = () => {
  // const user = adminUser;
  createUsers(5).forEach(user => {
    bcrypt.hash(user.password, saltRounds, async (err, password) => {
      try {
        user.password = password;
        const newUser = await User.query().insert(user);

        // const randNum = num => ~~(Math.random() * num + 1);
        // const randN = randNum(5);
        // console.log(randN);
        createRestaurants(5).forEach(async r => {
          try {
            const newRestaurants = await Restaurant.query().insert(r);
            console.log(`newUser: ${newUser}`);
            createCustomers(newUser.id, newRestaurants.id);
          } catch (error) {}
        });
      } catch (error) {
        console.log(error);
      }
    });
  });
};
