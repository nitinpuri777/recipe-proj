import 'dotenv/config'
const development = {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: 'postgres', 
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Note: This disables SSL certificate verification. Use with caution and only if you understand the security implications.
      }
    }
  }

  const production = {
    username: process.env.PROD_PGUSER,
    password: process.env.PROD_PGPASSWORD,
    database: process.env.PROD_PGDATABASE,
    host: process.env.PROD_PGHOST,
    dialect: 'postgres', 
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Note: This disables SSL certificate verification. Use with caution and only if you understand the security implications.
      }
    }
  }

  export default { development, production }