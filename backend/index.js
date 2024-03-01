import express from 'express'

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
        let isValid = (user) => (user.email === body.email && user.password === body.password) 
        return database.users.find(isValid)
    }
}

const Recipe = {
    //findAllForUser: (user) => database.recipes.filter(recipe => recipe.userId === user.id)
    findAllForUser: async (user) => {
        let matchesUserId = recipe => recipe.userId === user.id
        return database.recipes.filter(matchesUserId)
    }
}

app.get('/api/recipes', (req, res) => { 
    res.json([1,2,3,4])
})

app.use('/api', express.json())

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


app.use(express.static('frontend'))

app.listen(3000, () => {
    console.log('Server is Ready')
})