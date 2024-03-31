import User from "../models/user.js";
import { resolve } from 'path';
import StytchClient from "./stytch/stytch-client.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

async function authenticateSession(req, res, next) {
  let token = req.cookies.stytch_session

  StytchClient.sessions.authenticate({session_token: token})
    .then(async authResponse  =>  { 
      if(authResponse.status_code === 200) {
        let user = await User.findOrCreateByStytchUser(authResponse.user)
        if (!user) {
          next('USER_NOT_FOUND');
        }
        else {
            console.log(user)
            req.user = user;
            next();
        }
      }
      else {
        next('USER_NOT_AUTHENTICATED');
      }

    })
    .catch(err => { 
      next('USER_NOT_AUTHENTICATED');
    })

  
  

}

async function handleError(err, req, res, next) {
  switch (err) {
      case 'USER_NOT_FOUND':
          res.status(403).json({message: "User not authorized"})
          break;
      case 'USER_NOT_AUTHENTICATED':
      res.status(403).json({message: "User not authenticated"})
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
const Middleware = {handleError, loadContent, authenticateSession}
export default Middleware