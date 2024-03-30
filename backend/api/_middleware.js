import User from "../models/user.js";
import { resolve } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

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

async function loadContent(req,res,next) {
  const indexFilePath = resolve(process.cwd(),'frontend', 'index.html');
  res.sendFile(indexFilePath);
}
const Middleware = {authenticateToken, handleError, loadContent}
export default Middleware