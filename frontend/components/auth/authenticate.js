import stytchClient from "./stytch-client.js"

const Authenticate = {
  template: `<div class="row fill height_fill align_center"> Authenticating...</div>`,
  created: function() {
    this.authenticateToken()
  },
  methods: {
    authenticateToken: async function(){
      const queryParams = new URLSearchParams(window.location.search)
      const token = queryParams.get('token')
      const tokenType = queryParams.get('stytch_token_type')

      // If a token is found, authenticate it with the appropriate method.
      if (token && tokenType) {  
        if (tokenType === 'magic_links') {
          let authResponse = await stytchClient.magicLinks.authenticate(token, {
              session_duration_minutes: 60
            })
          console.log(authResponse)
          if(authResponse.status_code === 200) {
            console.log("Authenticated successfully")
            this.$emit('auth-success')
            //call the function to get the user or register and get the user
          }
          else {
            console.log(authResponse.error_message)
          }
            
        } else if (tokenType === 'oauth') {
          stytchClient.oauth
            .authenticate(token, {
              session_duration_minutes: 60
            })
            .then(() => {
              console.log('Successful authentication: OAuth')
              this.$emit('auth-success')
            })
            .catch((err) => {
              console.error(err)
              alert('OAuth authentication failed. See console for details.')
            })
        }
      } else {
        // If query params are not found, announce that something went wrong.
        alert('Something went wrong. No token found to authenticate.')
      }

    }
  }
}

export default Authenticate