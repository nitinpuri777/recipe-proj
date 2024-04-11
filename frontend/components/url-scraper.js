import { html } from "../globals.js"
const UrlScraper = {
  template: html`
  <div class="row gap_8 width_fill">
    <input class="rounded border border_color_gray pad_8 width_fill" type="text" placeholder="Paste your recipe url here." name="recipeName" v-model="urlToScrape"
      label="Url to Scrape">
      <router-link 
        :to="{ path: '/recipeDetail', query: { url: urlToScrape } }" 
        class="button rounded border text_nowrap">De-Clutter</router-link>
  </div>`,
  data() {
    return {
      urlToScrape: ""
    }
  }

}

export default UrlScraper