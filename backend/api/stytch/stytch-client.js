import 'dotenv/config'
import * as stytch from 'stytch'

let STYTCH_ENV_PREFIX = process.env.STYTCH_ENV_PREFIX

const StytchClient = new stytch.Client({
  project_id: process.env[`${STYTCH_ENV_PREFIX}STYTCH_PROJECT_ID`],
  secret: process.env[`${STYTCH_ENV_PREFIX}STYTCH_SECRET`],
});

export default StytchClient