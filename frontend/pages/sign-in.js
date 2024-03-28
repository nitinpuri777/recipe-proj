const SignInPage = {

  template: `<div class="row fill height_fill align_center">
  <form @submit.prevent="signInSubmit(email,password)" class="column pad_8 border gap_16">
     <div class="font_32 pad_bottom_8">Sign in</div>
     <div class="row gap_8">
     <div class="column align_center_y gap_8 font_bold">
      <span>Email:</span>
      <span>Password:</span>
    </div>
    <div class="column gap_8 font_bold">
      <input type="email" v-model="email" name="email" autocomplete="off" class="border">
      <input type="password" v-model="password" name="password" class="border">
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

}

export default SignInPage
	