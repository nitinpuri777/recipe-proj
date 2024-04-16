import AppHeader from '../components/app-header.js'
import RecipeList from '../components/recipe-list.js'
import RightOverlay from '../components/right-overlay.js'
import UrlScraper from '../components/url-scraper.js'

const RecipeListPage = {
  template: `
    <app-header />
    <div class="column pad_16 gap_16 max_width_1200px width_fill">
    <url-scraper/>
    <recipe-list class="height_fill"/>
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