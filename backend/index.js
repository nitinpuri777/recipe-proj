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
    }
    
}

const Recipe = {
    //findAllForUser: (user) => database.recipes.filter(recipe => recipe.userId === user.id)
    findAllForUser: async (user) => {
        let matchesUserId = recipe => recipe.userId === user.id
        return database.recipes.filter(matchesUserId)
    }
}


app.use('/api', express.json())
app.post('/api/recipes', async (req, res) => { 
    try {
            let user = await User.findValidUser(req.body)
            let recipes = await Recipe.findAllForUser(user)
            return res.status(200).json({recipes, message:'Login success'})
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({error:'not logged in'})
    }
    
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