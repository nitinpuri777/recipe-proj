import 'dotenv/config'
import pg from 'pg'
import { Sequelize, DataTypes, } from 'sequelize';
import User from './user.js';
import Recipe from './recipe.js';
import List from './list.js';
import ListItem from './listItem.js';
import MealPlan from './mealPlan.js';



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

User.initModel(sequelize)
Recipe.initModel(sequelize)
List.initModel(sequelize)
ListItem.initModel(sequelize)
MealPlan.initModel(sequelize)

List.hasMany(ListItem, { foreignKey: 'listId' });
ListItem.belongsTo(List, { foreignKey: 'listId' });

export default sequelize