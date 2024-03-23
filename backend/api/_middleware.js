import User from "../models/user.js";
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
       ;
  }
}

async function handleError(err, req, res, next) {
  switch (err) {
      case 'USER_NOT_FOUND':
          res.status(403).json({message: "User not authorized"})
          break;
    case 'RECIPE_NOT_FOUND':
        res.status(403).json({message: "Recipe not found"})
        break;   
      default:
          res.status(500).json({message: "Whoops!"})
          break;
  }
}
const Middleware = {authenticateToken, handleError}
export default Middleware