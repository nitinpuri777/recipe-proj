import 'dotenv/config'
import * as stytch from 'stytch'

const StytchClient = new stytch.Client({
  project_id: process.env.STYTCH_PROJECT_ID,
  secret: process.env.STYTCH_SECRET,
});

export default StytchClient