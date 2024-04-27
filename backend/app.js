import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import ApiSignIn from './api/sign-in.js'
import Middleware from './api/_middleware.js';
import ApiRecipes from './api/recipes.js';
import ApiScrape from './api/scrape.js';
import sequelize from './models/sequelize.js';

const STYTCH_ENV_PREFIX = process.env.STYTCH_ENV_PREFIX

//initialize db connection
sequelize.sync();


const app = express() 
app.use(express.json())
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
app.use('/api', Middleware.handleError)
app.use(express.static('frontend'))
app.get('*', Middleware.loadContent)

export default app