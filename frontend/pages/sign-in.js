const SignInPage = {

  template: `<div class="row fill height_fill align_center">
  <form novalidate="" onsubmit="onSignInFormSubmit(event)" class="column pad_8 border gap_16">
     <div class="font_32 pad_bottom_8">Sign in</div>
     <div class="row gap_8">
     <div class="column align_center_y gap_8 font_bold">
      <span>Email:</span>
      <span>Password:</span>
    </div>
    <div class="column gap_8 font_bold">
      <input type="email" v-model:email name="email" autocomplete="off" class="border">
      <input type="password" v-model:password name="password" class="border">
    </div>
    </div>
    <div class="row align_right"> <button type="submit" class="button">Sign in</button></div>
    
  </form>
</div>`,
data: function() {
  return {
    email: "",
    password: "",
  }
},
methods: { 
  signInSubmit: function(email, password) {
    this.$emit('sign-in-submit', email, password)
  }
}


// <script>
	// 	async function onSignInFormSubmit(event) {
	// 		event.preventDefault()
	// 		let url = '/api/sign-in'
	// 		let body = {
	// 			email: event.target.elements.email.value,
	// 			password: event.target.elements.password.value
	// 		}
	// 		let options = {
	// 			method: 'POST',
	// 			body: JSON.stringify(body),
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 			}
	// 		}
	// 		const response = await fetch(url, options)
	// 		const json = await response.json()
	// 		if (json.token != null) {
	// 			localStorage.setItem("authToken", json.token);
	// 			window.location.href = '/home.html'
	// 		}
	// 	}
	// </script>

}

export default SignInPage
