import stytchClient from "./stytch-client.js";
const StytchAuthUI = {
  mounted: function() {
    this.$nextTick(function () {
      this.initializeStytch();
    });
  },
  template: `<div class="row height_fill fill align_center"><div id="stytch-auth-ui"></div></div>`,
  methods: {
    initializeStytch() {
      const stytch = stytchClient
      let hostname = window.location.origin
      let redirectURL = `${hostname}/authenticate`
      stytch.mountLogin({
        elementId: '#stytch-auth-ui',
        config: {
          products: ['oauth','emailMagicLinks'],
          emailMagicLinksOptions: {
            loginRedirectURL: redirectURL,
            loginExpirationMinutes: 10080,
            signupRedirectURL: redirectURL,
            signupExpirationMinutes: 10080,
            createUserAsPending: true,
          },
          oauthOptions: {
            providers: [{ type: 'google' }],
            loginRedirectURL: redirectURL,
            signupRedirectURL: redirectURL,
          },
        },
        styles: {
          "container": {
            "backgroundColor": "#FFFFFF",
            "borderColor": "#ADBCC5",
            "borderRadius": "8px",
            "width": "400px"
          },
          "colors": {
            "primary": "#1f3245",
            "secondary": "#84969d",
            "success": "#0C5A56",
            "error": "#f3c2a3"
          },
          "buttons": {
            "primary": {
              "backgroundColor": "#1f3245",
              "textColor": "#FFFFFF",
              "borderColor": "#1f3245",
              "borderRadius": "4px"
            },
            "secondary": {
              "backgroundColor": "#FFFFFF",
              "textColor": "#1f3245",
              "borderColor": "#1f3245",
              "borderRadius": "4px"
            }
          },
          "inputs": {
            "backgroundColor": "#FFFFFF00",
            "borderColor": "#1f3245",
            "borderRadius": "4px",
            "placeholderColor": "#84969d",
            "textColor": "#1f3245"
          },
          "fontFamily": "Nunito",
          "hideHeaderText": false,
          "logo": {
            "logoImageUrl": "https://recipeace.xyz/assets/logo-stacked.png"
          }
        }
      })
    }
  },

}

export default StytchAuthUI
