import { html } from '../globals.js'
import RecipeDetail from '../components/recipe-detail.js'
import { useStore } from "../store.js"

const ScrapeDetailPage = {
  template: html`
    <recipe-detail class="max_width_1200px height_fill width_fill" />
  `,
  components: {
    RecipeDetail
  },
  computed: {
    store() {
      return useStore()
    }
  }
}

export default ScrapeDetailPage