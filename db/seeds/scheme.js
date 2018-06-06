const faker = require('faker');
const province = ["British Columbia", "Ontario", "Newfoundland", "Nova Scotia", "Prince Edward Island", "New Brunswick", "Quebec", "Manitoba", "Saskatchewan", "Alberta", "Northwest Territories", "Nunavut", "Yukon Territory"];

const createUser = knex => knex('users').insert({
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
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
    province: province[~~(Math.random() * province.length)],
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
  )