import { useStore } from "../../store.js";

const Authenticate = {
  template: `<div class="row fill height_fill align_center"> Authenticating...</div>`,
  created() {
    this.authenticateToken()
  },
  methods: {
    async authenticateToken() {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get('token');
      const tokenType = queryParams.get('stytch_token_type');
      const next_route = queryParams.get('next_route');

      if (token && tokenType) {
        if (tokenType === 'magic_links') {
          // Use the computed property 'store' to access store actions
          await this.$store.authenticateMagicLink(token, next_route);
        } else if (tokenType === 'oauth') {
          // Use the computed property 'store' to access store actions
          await this.$store.authenticateOAuth(token, next_route);
        }
      } else {
        alert('Something went wrong. No token found to authenticate.');
      }
    }
  }
}

export default Authenticate
