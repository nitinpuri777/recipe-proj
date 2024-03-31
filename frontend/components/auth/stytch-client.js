import { StytchUIClient } from 'stytch'

let stytchPublicToken = ""
await fetch('/api/env')
  .then(response => response.json())
  .then(data => {
    stytchPublicToken = data.VUE_APP_STYTCH_PUBLIC_TOKEN;
  })

const stytchClient = new StytchUIClient(stytchPublicToken)


export default stytchClient