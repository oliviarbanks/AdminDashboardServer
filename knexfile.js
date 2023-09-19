require('dotenv').config();
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
      client: 'mysql2',
      connection: {
        user: 'root',
        host: 'localhost',
        password: 'NursEDev2023!',
        database: 'ambassadorEarnings',
      },
      // migrations: {
      //   directory: './migrations', // Specify the directory where your migrations are stored
      // },
      // seeds: {
      //   directory: './seeds', // Specify the directory where your seeds are stored
      // },
    };