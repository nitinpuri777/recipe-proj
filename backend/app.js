import express from 'express'
import ApiSignIn from './api/sign-in.js'
import Middleware from './api/_middleware.js';
import ApiRecipes from './api/recipes.js';
const app = express() 
app.use(express.json())
app.post('/api/sign-in', ApiSignIn.post)
app.use('/api', Middleware.authenticateToken)
app.get('/api/recipes', ApiRecipes.get)
app.post('/api/recipes', ApiRecipes.post)
app.delete('/api/recipes/:id', ApiRecipes.delete_)
app.put('/api/recipes/:id', ApiRecipes.put)
app.use('/api', Middleware.handleError)
app.use(express.static('frontend'))

export default app