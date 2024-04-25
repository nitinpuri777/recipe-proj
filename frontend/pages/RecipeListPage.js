import AppHeader from '../components/app-header.js'
import RecipeList from '../components/recipe-list.js'
import SearchHeader from '../components/search-header.js'
import UrlScraper from '../components/url-scraper.js'

const RecipeListPage = {
  template: `
    <search-header class="search_bar_input" :class="searchHeaderClasses" />
    <app-header />
      <div class="column pad_16 width_transition gap_16 width_fill height_fill" :class="searchModeWidthClasses">
        <div class="row width_fill align_center_x">
          <url-scraper class="pad_top_16 pad_bottom_16 max_width_800px"/>
        </div>
        <template v-if="loading" class="column width_fill height_fill">
          <loader></loader>
    </template>
    <template v-else>
      <recipe-list />
    </template>
  </div>
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
    searchModeWidthClasses() { 
      if(!this.searchMode) {
        return "max_width_1200px"
      }
      else {
        return "max_width_fill"
      }
      
    },
    searchHeaderClasses() { 
      if(this.searchMode) {
        return "search_bar_input--show"
      }
      else {
        return ""
      }
      
    },
    collapsibleClasses() { 
      if(this.searchMode) {
        return "collapsible_div--hidden"
      }
      else {
        return ""
      }
      
    }
  }

}

export default RecipeListPage