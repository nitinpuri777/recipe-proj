const Header = {
  template: 
  `<div class="row width_fill border_bottom pad_left_16 pad_right_16 pad_top_16 pad_bottom_16 gap_32">
    <div class="row width_240px shrink_none">
      <a href="/"><img src="/assets/logo.png" class="width_fill"></a>
    </div>
    <div class="row align_right width_fill">
      <div class="row shrink_none align_center">
      <a @click="signOut" class="pad_8 button rounded border">Sign Out</a>
      </div>
    </div>
  </div>`,
  methods: {
    signOut: function () {
      this.$emit("sign-out");
    }
  }

}
export default Header