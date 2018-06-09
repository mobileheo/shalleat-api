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

const createUser = iteration =>
  [...Array(iteration)].map(user => {
    return {
      email: email(),
      password: faker.internet.password(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      provider: ["google", "facebook", "instagram"][~~(Math.random() * 3)]
    };
  });

const createRest = knex =>
  knex("restaurants").insert({
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
  });

const createRestCust = (knex, customerId, restaurantId) => {
  return knex("restaurants_customers").insert({
    customerId,
    restaurantId
  });
};

// exports.seed = knex =>
//   knex("users")
//     .del()
//     .then(() => {
//       const users = [...Array(10)].map(user => createUser(knex));
//       return Promise.all(users);
//     })
//     .then(() =>
//       knex("restaurants")
//         .del()
//         .then(() => {
//           const restaurants = [...Array(10)].map(restaurant =>
//             createRest(knex)
//           );
//           return Promise.all(restaurants);
//         })
//     )
//     .then(() => {
//       bcrypt.hash(adminUser.password, saltRounds, async function(
//         err,
//         password
//       ) {
//         try {
//           adminUser.password = password;
//           const user = await User.query().insert(adminUser);
//           // return user;
//         } catch (error) {
//           console.log(error);
//         }
//       });
//     });
exports.seed = () => {
  // const user = adminUser;
  createUser(5).forEach(user => {
    bcrypt.hash(user.password, saltRounds, async function(err, password) {
      try {
        user.password = password;
        const newUser = await User.query().insert(user);
      } catch (error) {
        console.log(error);
      }
    });
  });
};
