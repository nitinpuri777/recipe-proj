const Header = {
  template: 
  `<div class="row shrink_none width_fill border_bottom pad_8">
    <div class="row gap_fill">
      <img src="/assets/logo.png" class="width_240px pad_16"></img>
    </div>
    <div class="row align_right width_fill">
    <div class="row align_center"><a @click="signOut" class="pad_16 recipe_link">Sign Out</a></div>
    </div>
  </div>`,
  methods: {
    signOut: function () {
      this.$emit("sign-out");
    }
  }

}
export default Header