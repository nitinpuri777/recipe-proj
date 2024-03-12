import User from '../models/user.js'

const post = async (req, res) => {
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
}

const ApiSignIn = {
  post
}

export default ApiSignIn
