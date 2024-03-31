import 'dotenv/config'
import pg from 'pg'
import express from 'express'
import cookieParser from 'cookie-parser'
import ApiSignIn from './api/sign-in.js'
import Middleware from './api/_middleware.js';
import ApiRecipes from './api/recipes.js';
import ApiScrape from './api/scrape.js';
import { Sequelize, DataTypes, } from 'sequelize';
import User from './models/user.js';
import Recipe from './models/recipe.js';

const sequelize = new Sequelize({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    }
  }
}, { sequelize, modelName: 'recipe' });


sequelize.sync();
//sequelize

const app = express() 
app.use(express.json())
app.use(cookieParser())
app.get('/api/env', (req, res) => {
  res.json({
    VUE_APP_STYTCH_PUBLIC_TOKEN: process.env.VUE_APP_STYTCH_PUBLIC_TOKEN
  });
});
app.use('/api', Middleware.authenticateSession)
app.post('/api/sign-in', ApiSignIn.post)
app.get('/api/recipes', ApiRecipes.get)
app.post('/api/recipes', ApiRecipes.post)
app.delete('/api/recipes/:id', ApiRecipes.delete_)
app.put('/api/recipes/:id', ApiRecipes.put)
app.post('/api/scrape', ApiScrape.post)
app.get('/api/recipe/:id', ApiRecipes.find)
app.use('/api', Middleware.handleError)
app.use(express.static('frontend'))
app.get('*', Middleware.loadContent)

export default app