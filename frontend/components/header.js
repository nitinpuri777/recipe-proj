import { html } from "../globals.js";
import { useStore } from "../store.js";

const Header = {
  template: html`
    <div class="row width_fill border_bottom border_color_gray align_center_x">
      <div class="row max_width_1200px width_fill  pad_left_16 pad_right_16 pad_top_16 pad_bottom_16 gap_32">
        <div class="row width_240px shrink_none">
          <a href="/"><img src="/assets/logo.png" class="width_fill"></a>
        </div>
        <div class="row align_right width_fill">
          <div class="row shrink_none align_center">
            <a @click="signOut" class="pad_8 button rounded border">Sign Out</a>
          </div>
        </div>
      </div>
    </div>`,
  computed: {
    store() {
      return useStore();
    }
  },
  methods: {
    signOut() {
      this.store.signOut(); // Call the signOut action defined in your store
    }
  }
}

export default Header
