import express from 'express'
import ApiSignIn from '../../backend/api/sign-in.js';
import Middleware from '../../backend/api/_middleware.js';
import ApiRecipes from '../../backend/api/recipes.js';
const app = express() 
app.use(express.json())
app.post('/api/sign-in', ApiSignIn.post)
app.use('/api', Middleware.authenticateToken)
app.get('/api/recipes', ApiRecipes.get)
app.post('/api/recipes', ApiRecipes.post)
app.delete('/api/recipes/:id', ApiRecipes.delete_)
app.use('/api', Middleware.handleError)
app.use(express.static('frontend'))
app.listen(3000, () => {
    console.info('Server is Ready')
})