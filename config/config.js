import 'dotenv/config'
const DB_PREFIX = process.env.DB_PREFIX;

const development = {
    host: process.env[`${DB_PREFIX}PGHOST`],
    database: process.env[`${DB_PREFIX}PGDATABASE`],
    username: process.env[`${DB_PREFIX}PGUSER`],
    password: process.env[`${DB_PREFIX}PGPASSWORD`],
    dialect: 'postgres', 
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Note: This disables SSL certificate verification. Use with caution and only if you understand the security implications.
      }
    }
  }

  const production = {
    host: process.env[`${DB_PREFIX}PGHOST`],
    database: process.env[`${DB_PREFIX}PGDATABASE`],
    username: process.env[`${DB_PREFIX}PGUSER`],
    password: process.env[`${DB_PREFIX}PGPASSWORD`],
    dialect: 'postgres', 
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Note: This disables SSL certificate verification. Use with caution and only if you understand the security implications.
      }
    }
  }

  export default { development, production }