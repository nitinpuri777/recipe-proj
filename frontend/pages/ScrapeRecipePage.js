import { html } from "../globals.js"
import AppHeader from "../components/app-header.js"
import { useStore } from "../store.js"

const ScrapeRecipePage = {
  template: html`
    <app-header />
    <div class="row width_fill pad_16 align_center_x">
    <div class="column gap_8 width_fill max_width_500px">
        <div class="row gap_8">
          <input class="rounded border border_color_gray pad_8 width_fill" type="text" placeholder="Paste your recipe url here." name="recipeName" v-model="urlToScrape"
            label="Url to Scrape">
            <router-link 
              :to="{ path: '/recipeDetail', query: { url: urlToScrape } }" 
              class="button rounded border text_nowrap">Fetch Recipe</router-link>
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