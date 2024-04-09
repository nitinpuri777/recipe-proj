import { html } from "../globals.js"
import AppHeader from "../components/app-header.js"
import { useStore } from "../store.js"

const ScrapeRecipePage = {
  template: html`
<app-header />
<div class="row width_fill pad_left_16 pad_right_16 pad_top_32 align_center_x">
<div class="column gap_32 width_fill max_width_680px align_center_x">
  <div class="column gap_8 align_center_x">
  <div class="row font_48 font_700 text_center">
    Cooking without the chaos.
  </div>
  <div class="row">
    Just get the recipe. No ads. No videos. No life stories.
  </div>
</div>
  <div class="row gap_8 width_fill">
    <input class="rounded border border_color_gray pad_8 width_fill" type="text" placeholder="Paste your recipe url here." name="recipeName" v-model="urlToScrape"
      label="Url to Scrape">
      <router-link 
        :to="{ path: '/recipeDetail', query: { url: urlToScrape } }" 
        class="button rounded border text_nowrap">De-Clutter</router-link>
  </div>
</div>
</div>
  `,
  components: {
    AppHeader
  },
  data() {
    return {
      urlToScrape: ""
    }
  },
  computed: {
    store() {
      return useStore()
    }
  },
  methods: {
  }
}

export default ScrapeRecipePage