import express from 'express'
import ApiSignIn from './api/sign-in.js'
import Middleware from './api/_middleware.js';
import ApiRecipes from './api/recipes.js';
import ApiScrape from './api/scrape.js';
// import { Sequelize, DataTypes } from 'sequelize';
const { Sequelize, DataTypes } = await import('sequelize');
import User from './models/user.js';
import Recipe from './models/recipe.js';

//sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});
User.init({
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  token: DataTypes.STRING
}, { sequelize, modelName: 'user' });
Recipe.init({
  name: DataTypes.STRING,
  // Storing ingredients and steps as JSON strings
  ingredients: DataTypes.JSON,
  steps: DataTypes.JSON,
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Assuming 'Users' is the table name for your User model
      key: 'id',
    }
  }
}, { sequelize, modelName: 'recipe' });


sequelize.sync();
//sequelize

const app = express() 
app.use(express.json())
app.post('/api/sign-in', ApiSignIn.post)
app.use('/api', Middleware.authenticateToken)
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