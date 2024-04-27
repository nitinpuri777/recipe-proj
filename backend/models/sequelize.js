import 'dotenv/config'
import pg from 'pg'
import { Sequelize, DataTypes, } from 'sequelize';
import User from './user.js';
import Recipe from './recipe.js';



// Determine which set of credentials to use
const DB_PREFIX = process.env.DB_PREFIX;

// Use the appropriate credentials based on the active DB service
const sequelize = new Sequelize({
  host: process.env[`${DB_PREFIX}PGHOST`],
  database: process.env[`${DB_PREFIX}PGDATABASE`],
  username: process.env[`${DB_PREFIX}PGUSER`],
  password: process.env[`${DB_PREFIX}PGPASSWORD`],
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false 
    }
  },
  logging: false 
})
User.init({
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  token: DataTypes.STRING,
  stytchUserId: DataTypes.STRING
}, { sequelize, modelName: 'user' });
Recipe.init({
  name: DataTypes.STRING,
  ingredients: DataTypes.JSON,
  steps: DataTypes.JSON,
  image_url: DataTypes.STRING,
  hostname: DataTypes.STRING,
  url: DataTypes.STRING,
  ld_json: DataTypes.JSON,
  serving_size: DataTypes.INTEGER,
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    }
  }
}, { sequelize, modelName: 'recipe' });

export default sequelize