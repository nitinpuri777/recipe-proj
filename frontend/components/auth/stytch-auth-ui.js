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
          products: ['emailMagicLinks'],
          emailMagicLinksOptions: {
            loginRedirectURL: redirectURL,
            loginExpirationMinutes: 30,
            signupRedirectURL: redirectURL,
            signupExpirationMinutes: 30,
            createUserAsPending: true,
          },
          // oauthOptions: {
          //   providers: [{ type: 'google' }],
          //   loginRedirectURL: redirectURL,
          //   signupRedirectURL: redirectURL,
          // },
        },
      })
    }
  },

}

export default StytchAuthUI
