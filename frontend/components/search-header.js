import { html } from "../globals.js";

const SearchHeader = {
  template: html`
    <div class="row width_fill border_bottom border_color_gray align_center_x bg_white">
      <div class="row align_left width_fill pad_left_16 pad_right_16 gap_16">
        <div class="row height_76px align_center_y shrink_none">
          <img @click="disableSearchMode" src="/assets/icons/arrow-left.svg" class="icon height_28px">
        </div>
        <input type="text" ref="searchInput" v-model="this.$store.searchQuery" class="width_fill height_fill font_20 input_no_outline" placeholder="Search by recipe name or ingredient">
      </div>
    </div>`,
  methods: {
    disableSearchMode() {
      this.$store.searchMode = false;
      this.$store.searchQuery = ""
    }
  },
  computed: {
    focus() { 
      return this.$store.focusSearchInput
    }
  },
  watch: {
    focus(newFocus, oldFocus) {
      if (newFocus) {
        this.$refs.searchInput.focus()
      }
    }
  },
}

export default SearchHeader
