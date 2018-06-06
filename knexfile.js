module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'shall_eat_api_dev'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + `?ssl=true`,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds'
    },
    useNullAsDefault: true
  }
}