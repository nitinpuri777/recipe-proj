import { html } from "../globals.js"
import AppHeader from "../components/app-header.js"
import UrlScraper from "../components/url-scraper.js"

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
  <url-scraper></url-scraper>
</div>
</div>
  `,
   mounted() {
    if(this.$store.isAuthenticated) {
      this.$router.push('/app')
    }
  },
  components: {
    AppHeader,
    UrlScraper
  }
}

export default ScrapeRecipePage