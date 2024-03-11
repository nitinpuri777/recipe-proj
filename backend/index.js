import express from 'express'
import * as url from 'url';
import * as path from 'path';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express() 
const database = {
    users: [
        {
            id: 1,
            name: "Nitin Puri",
            email: "nitin@gmail.com",
            password: "nitinPass",
            token: "nitinToken"

        }, 
        {
            id: 2,
            name: "Ryan Haskell-Glatz",
            email: "ryan@gmail.com",
            password: "ryanPass",
            token: "ryanToken"

        }
    ],
    recipes: [
        {
            id:1,
            name: "Pizza",
            userId: 1
        },
        {
            id:2,
            name: "Taco",
            userId: 2
        },
        {
            id:3,
            name: "Donut",
            userId: 2
        }
    ]

}

//Global Functions
async function authenticateToken(req, res, next) {
    let authHeader = req.header("Authorization")
    if (authHeader.startsWith("Bearer ")) {
        let authToken = authHeader.slice("Bearer ".length)
        let user = await User.findByToken(authToken);
        if (!user) {
            next('USER_NOT_FOUND');
        }
        else {
            req.user = user;
            next();
        }
    
    }
    else {
        next('USER_NOT_FOUND');
    }
}

async function handleError(err, req, res, next) {
    switch (err) {
        case 'USER_NOT_FOUND':
            res.status(403).json({message: "User not authorized"})
            break;
    
        default:
            res.status(500).json({message: "Whoops!"})
            break;
    }
}


//Class Functions
const User = {
    findByToken: async(token) => {
        let isValid = (user) => (user.token === token)
            return database.users.find(isValid)
    },

    findValidUser: async (body) => {
        if (!body.token) {
            let isValid = (user) => (user.email === body.email && user.password === body.password) 
            return database.users.find(isValid)
        }
        else {
            let isValid = (user) => (user.token === body.token)
            return database.users.find(isValid)
        }
    },
    findId: async (user) => {
        return user.id
    }
    
}

const Recipe = {
    //findAllForUser: (user) => database.recipes.filter(recipe => recipe.userId === user.id)
    findAllForUser: async (user) => {
        let matchesUserId = recipe => recipe.userId === user.id
        return database.recipes.filter(matchesUserId)
    },
    addRecipe: async (user, recipe) => {
        let userId = await User.findId(user)
        let name = recipe.name
        let id = await Recipe.getMaxId() + 1
        let newRecipe = {
            id,
            name,
            userId
        }
        database.recipes.push(newRecipe)
        return Recipe.findAllForUser(user)
    },

    removeRecipe: async (user, recipeToRemoveId) => {
        let isRecipeToRemove = recipe => recipe.id == recipeToRemoveId
        const recipeIndexToRemove = database.recipes.findIndex(isRecipeToRemove)
        if(recipeIndexToRemove !== -1){
            database.recipes.splice(recipeIndexToRemove, 1);
        }
        return Recipe.findAllForUser(user)
    },

    getMaxId: async () => {
        let getMax = (valueSoFar, recipe) => {
            return Math.max(valueSoFar, recipe.id)}
        return database.recipes.reduce(getMax, 0);
    }
        


    }


app.use(express.json())

app.post('/api/signin', async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
        return res.status(400).json({error: 'Both email and pass are required'})
    } else {
        let validUser = await User.findValidUser(req.body) 
        if (validUser === undefined) {
            return res.status(400).json({error: 'Did not find a user with that email and password'})
        } else {
            let token = validUser.token
            return res.status(200).json({token, message:'Login success'})
        }
    }
})
app.use('/api', authenticateToken)

//Routes
app.get('/api/recipes', async (req, res) => { 
    try {
            let user = req.user
            let recipes = await Recipe.findAllForUser(user)
            return res.status(200).json({recipes})
        
    } catch (error) {
        return res.status(400).json({error})
    }
    
})

app.post('/api/recipes', async (req, res) => {
    let user = req.user
    let recipes = await Recipe.addRecipe(user, req.body.recipe)
    return res.status(200).json({recipes})
})

app.delete('/api/recipes/:id', async (req, res) => {
    let recipeId = req.params.id
    let user = req.user
    let recipes = await Recipe.removeRecipe(user, recipeId)
    return res.status(200).json({recipes})
})

app.get('/home', (req,res) => {
    res.sendFile('home.html');
})

app.use('/api', handleError)
app.use(express.static('frontend'))

app.listen(3000, () => {
    console.info('Server is Ready')
})