const Sidebar = {
  template: `<aside class="column border_right gap_16 shrink_none position_sticky top_0 height_fill">
  <img src="/assets/logo.svg" class="width_240px pad_16"></img>
  <div class="column gap_fill fill">
    <div class="column">
      <a href="#button1" class="pad_16 sidebar_link">Button 1</a>
      <a href="#button2" class="pad_16 sidebar_link">Button 2</a>
      <a href="#button3" class="pad_16 sidebar_link">Button 3</a>
    </div>
    <div class="column">
      <a @click="signOut" class="pad_16 sidebar_link">Sign Out</a>
    </div>
  </div>
</aside>`,
  methods: {
    signOut: function () {
      this.$emit("sign-out");
    }
  }

}
export default Sidebar