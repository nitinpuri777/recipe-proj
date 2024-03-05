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



const User = {
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
        console.log(newRecipe)
        return Recipe.findAllForUser(user)
    },

    removeRecipe: async (user, recipeToRemove) => {
        let isRecipeToRemove = recipe => recipe.id == recipeToRemove.id
        const recipeIndexToRemove = database.recipes.findIndex(isRecipeToRemove)
        if(recipeIndexToRemove !== -1){
            database.recipes.splice(recipeIndexToRemove, 1);
        }
        return Recipe.findAllForUser(user)
    },

    getMaxId: async () => {
        return database.recipes.reduce((maxId, recipe) => {
            return Math.max(maxId, recipe.id);
          }, -Infinity);
    }
        


    }



app.use('/api', express.json())
app.post('/api/recipes', async (req, res) => { 
    try {
            let user = await User.findValidUser(req.body)
            let recipes = await Recipe.findAllForUser(user)
            return res.status(200).json({recipes})
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({error})
    }
    
})

app.post('/api/addRecipe', async (req, res) => {
    let user = await User.findValidUser(req.body)
    console.log(req.body.recipe)
    let recipes = await Recipe.addRecipe(user, req.body.recipe)
    return res.status(200).json({recipes})
})

app.post('/api/removeRecipe', async (req, res) => {
    let user = await User.findValidUser(req.body)
    console.log(req.body.recipe)
    let recipes = await Recipe.removeRecipe(user, req.body.recipe)
    return res.status(200).json({recipes})
})


app.post('/api/signin', async (req, res) => {
    console.log(req.body)
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
        console.log('need both')
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

app.get('/home', (req,res) => {
    res.sendFile('home.html');
})


app.use(express.static('frontend'))

app.listen(3000, () => {
    console.log('Server is Ready')
})