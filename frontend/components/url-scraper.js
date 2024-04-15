import { html } from "../globals.js"
const UrlScraper = {
  template: html`
  <div class="row gap_8 width_fill">
    <input class="rounded border border_color_gray pad_8 width_fill" type="text" placeholder="Paste your recipe url here." name="recipeName" v-model="urlToScrape"
      label="Url to Scrape">
      <button @click="scrapeUrl"
        class="button rounded border text_nowrap">De-Clutter</button>
  </div>`,
  data() {
    return {
      urlToScrape: ""
    }
  },
  methods: {
    async scrapeUrl() {
      try {
        this.$store.recipeToView = await this.$store.scrapeRecipe(this.urlToScrape);
      } catch (error) {
        console.log(error)
      } finally {
        this.$router.push('/recipeDetail')   }
      }
      
  }

}

export default UrlScraper