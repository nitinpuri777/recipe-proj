import AppHeader from '../components/app-header.js'
import RecipeList from '../components/recipe-list.js'
import SearchHeader from '../components/search-header.js'
import UrlScraper from '../components/url-scraper.js'

const RecipeListPage = {
  template: `
    <template v-if="!searchMode">
      <app-header v-if="!searchMode"/>
      <div class="column pad_16 gap_32 width_fill height_fill max_width_1200px">
        <div v-if="!searchMode" class="row width_fill align_center_x ">
          <url-scraper class="pad_top_16 pad_bottom_16 max_width_800px" />
        </div>
        <template v-if="loading" class="column width_fill height_fill">
          <loader></loader>
        </template>
        <template v-else>
        <recipe-list />
        </template>
      </div>
    </template>
    <template v-else>
    <search-header/>
    <div class="column pad_16 gap_32 width_fill height_fill">
        <template v-if="loading" class="column width_fill height_fill">
          <loader></loader>
        </template>
        <template v-else>
        <recipe-list />
        </template>
      </div>
    </template>
  `,
  components: {
    AppHeader,
    RecipeList,
    UrlScraper,
    SearchHeader
  },
  async mounted() {
    this.loading = true;
    await this.$store.loadRecipes(); 
    this.loading = false;// Load recipes from the $store when the component mounts
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    searchMode() {
      return this.$store.searchMode
    },
    searchModeClasses() { 
      if(!this.searchMode) {
        return "max_width_1200px"
      }
      else {
        return ""
      }
      
    }
  }

}

export default RecipeListPage