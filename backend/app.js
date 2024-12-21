import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import ApiSignIn from './api/sign-in.js'
import Middleware from './api/_middleware.js';
import ApiRecipes from './api/recipes.js';
import ApiScrape from './api/scrape.js';
import sequelize from './models/sequelize.js';
import ApiLists from './api/lists.js';
import ApiListItems from './api/listItems.js';

const STYTCH_ENV_PREFIX = process.env.STYTCH_ENV_PREFIX

//initialize db connection
sequelize.sync();


const app = express() 
app.use(express.json())
app.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT" || req.method === "DELETE") {
      console.log(`Received ${req.method} at ${req.path}:`, JSON.stringify(req.body));
  }
  next();
});
app.use(cookieParser())
app.get('/api/env', (req, res) => {
  res.json({
    VUE_APP_STYTCH_PUBLIC_TOKEN: process.env[`${STYTCH_ENV_PREFIX}VUE_APP_STYTCH_PUBLIC_TOKEN`]
  });
});
app.post('/api/scrape', ApiScrape.post)
app.use('/api', Middleware.authenticateSession)
app.post('/api/sign-in', ApiSignIn.post)
app.get('/api/recipes', ApiRecipes.get)
app.post('/api/recipes', ApiRecipes.post)
app.delete('/api/recipes/:id', ApiRecipes.delete_)
app.put('/api/recipes/:id', ApiRecipes.put)
app.get('/api/recipe/:id', ApiRecipes.find)
app.get('/api/lists/:listId/items', ApiListItems.get)
app.post('/api/lists/:listId/items', ApiListItems.add)
app.delete('/api/lists/:listId/items/:listItemId', ApiListItems.delete_)
app.put('/api/lists/:listId/items/:itemId', ApiListItems.update)
app.get('/api/lists', ApiLists.find)
app.post('/api/lists', ApiLists.create)
app.delete('/api/lists/:id', ApiLists.delete_)
app.use('/api', Middleware.handleError)
app.use(express.static('frontend'))
app.get('*', Middleware.loadContent)
app.post('/api/lists/:listId/items/categorize', ApiListItems.categorize)

export default app