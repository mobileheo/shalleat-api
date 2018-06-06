const faker = require('faker');
const provinces = ["British Columbia", "Ontario", "Newfoundland", "Nova Scotia", "Prince Edward Island", "New Brunswick", "Quebec", "Manitoba", "Saskatchewan", "Alberta", "Northwest Territories", "Nunavut", "Yukon Territory"];

const createUser = knex => knex('users').insert({
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  provider: ["google", "facebook", "instagram"][~~(Math.random() * 3)],
})

const createRest = knex => knex('restaurants').insert({
  name: faker.company.companyName(),
  description: faker.company.bsBuzz(),
  phone_number: faker.phone.phoneNumber(),
  geo_location: {
    lat: faker.address.latitude(),
    lon: faker.address.longitude(),
  },
  address: {
    street: faker.address.streetAddress(),
    city: faker.address.city(),
    province: provinces[~~(Math.random() * provinces.length)],
    zipCode: faker.address.zipCode()
  }
})

const createRestCust = (knex, customerId, restaurantId) => {
  return knex('restaurants_customers').insert({
    customerId,
    restaurantId
  })
}

exports.seed = knex =>
  knex('users').del()
  .then(() => {
    const users = [...Array(100)].map(user => createUser(knex));
    return Promise.all(users);
  })
  .then(() => knex('restaurants').del()
    .then(() => {
      const restaurants = [...Array(100)].map(restaurant => createRest(knex));
      return Promise.all(restaurants);
    })
  ).then(() => knex('restaurants_customers').del()
    .then(() => {
      const customers = [...Array(50)].map(customer => {
        let [firstRand, secondRand] = [~~(Math.random() * 100), ~~(Math.random() * 100)];
        return createRestCust(knex, firstRand, secondRand);
      })
      return Promise.all(customers);
    })
  )