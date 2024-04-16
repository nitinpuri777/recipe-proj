import AppHeader from '../components/app-header.js'
import RecipeList from '../components/recipe-list.js'
import RightOverlay from '../components/right-overlay.js'
import UrlScraper from '../components/url-scraper.js'

const RecipeListPage = {
  template: `
    <app-header />
    <div class="column pad_16 gap_32 max_width_1200px width_fill height_fill">
    <div class="row width_fill align_center_x">
     <url-scraper class="pad_top_16 pad_bottom_16 max_width_800px" />
    </div>
     <recipe-list />
    </div>
    <right-overlay />

  `,
  components: {
    AppHeader,
    RecipeList,
    RightOverlay,
    UrlScraper
  }

}

export default RecipeListPage