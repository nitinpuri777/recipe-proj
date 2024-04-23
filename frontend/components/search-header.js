import { html } from "../globals.js";

const SearchHeader = {
  template: html`
    <div class="row width_fill border_bottom border_color_gray align_center_x">
      <div class="row align_left width_fill pad_left_16 pad_right_16 gap_32">
        <div class="row shrink_none">
          <img @click="disableSearchMode" src="/assets/icons/arrow-left.svg" class="icon pad_top_16 pad_bottom_16">
        </div>
        <input type="text" ref="searchInput" v-model="this.$store.searchQuery" class="width_fill height_fill font_24 input_no_outline" placeholder="Search by recipe name or ingredient">
      </div>
    </div>`,
  methods: {
    disableSearchMode() {
      this.$store.searchMode = false;
    }
  },
  mounted() {
    this.$refs.searchInput.focus()
  }
}

export default SearchHeader
