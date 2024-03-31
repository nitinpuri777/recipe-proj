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
      stytch.mountLogin({
        elementId: '#stytch-auth-ui',
        config: {
          products: ['emailMagicLinks'],
          emailMagicLinksOptions: {
            loginRedirectURL: 'http://localhost:3000/authenticate',
            loginExpirationMinutes: 30,
            signupRedirectURL: 'http://localhost:3000/authenticate',
            signupExpirationMinutes: 30,
            createUserAsPending: true,
          },
          // oauthOptions: {
          //   providers: [{ type: 'google' }],
          //   loginRedirectURL: 'http://localhost:3000/authenticate',
          //   signupRedirectURL: 'http://localhost:3000/authenticate',
          // },
        },
      })
    }
  },

}

export default StytchAuthUI
