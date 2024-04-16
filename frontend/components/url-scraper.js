import { html } from "../globals.js"
const UrlScraper = {
  template: html`
  <div class="column width_fill gap_8">
    <div class="row gap_8 width_fill">
      <input class="rounded border border_color_gray pad_8 width_fill" type="text" placeholder="Paste your recipe url here." name="recipeName" v-model="urlToScrape"
        label="Url to Scrape">
        <button @click="scrapeUrl"
          class="row button rounded border text_nowrap">
          <span v-if="loading" class="dots height_fill">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </span>
        <span v-else>De-Clutter</span>
        </button>
    </div>
    <div v-if="error" class="font_error"> Couldn't find a recipe at that URL.  Try again!
</div>
  </div>`,
  data() {
    return {
      urlToScrape: "",
      error: false,
      loading: false,
    }
  },
  methods: {
    async scrapeUrl() {
      this.error = false;
      try {
        this.loading = true
        this.$store.recipeToView = await this.$store.scrapeRecipe(this.urlToScrape);
        this.loading = false
        this.$router.push({ path: '/recipeDetail', query: {url: this.urlToScrape}});
      } catch (error) {
        this.loading = false
        this.error = true
      }
      
  }
}

}

export default UrlScraper